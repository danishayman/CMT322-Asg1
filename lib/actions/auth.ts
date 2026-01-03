'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { User, UserRole } from '@/lib/types/database'

export interface AuthResult {
  success: boolean
  error?: string
  user?: User
  redirectTo?: string
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResult> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  if (!data.user) {
    return { success: false, error: 'Login failed. Please try again.' }
  }

  // Get user profile and role using admin client to bypass RLS during login
  const supabaseAdmin = createAdminClient()
  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('auth_id', data.user.id)
    .single()

  if (userError || !userData) {
    console.error('User profile lookup error:', userError)
    return { success: false, error: 'User profile not found. Please contact admin.' }
  }

  if (!userData.is_active) {
    await supabase.auth.signOut()
    return { success: false, error: 'Your account has been deactivated. Please contact admin.' }
  }

  // Determine redirect path based on role
  let redirectTo = '/login'
  switch (userData.user_role) {
    case 'student':
      redirectTo = '/student'
      break
    case 'staff':
      redirectTo = '/staff'
      break
    case 'admin':
      redirectTo = '/admin'
      break
  }

  return { success: true, user: userData, redirectTo }
}

/**
 * Sign up a new student account
 */
export async function signUpStudent(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResult> {
  // Validate student email domain
  if (!email.endsWith('@student.usm.my')) {
    return { success: false, error: 'Student registration requires a @student.usm.my email address.' }
  }

  const supabase = await createClient()

  // Sign up with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        user_role: 'student',
      },
    },
  })

  if (error) {
    return { success: false, error: error.message }
  }

  if (!data.user) {
    return { success: false, error: 'Registration failed. Please try again.' }
  }

  // Use admin client to create the profile (bypasses RLS)
  const supabaseAdmin = createAdminClient()

  // First check if profile already exists (in case trigger created it)
  const { data: existingProfile } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('auth_id', data.user.id)
    .maybeSingle()

  if (existingProfile) {
    return {
      success: true,
      user: existingProfile,
      redirectTo: '/student'
    }
  }

  // Create the profile
  const { data: userData, error: userError } = await supabaseAdmin
    .from('users')
    .insert({
      auth_id: data.user.id,
      email: email,
      full_name: fullName,
      user_role: 'student' as UserRole,
      is_active: true,
    })
    .select()
    .single()

  if (userError) {
    console.error('Failed to create user profile:', userError)
    return { success: false, error: `Failed to create user profile: ${userError.message}` }
  }

  return {
    success: true,
    user: userData,
    redirectTo: '/student'
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

/**
 * Get current authenticated user with profile
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Use admin client to bypass RLS during session lookup
  const supabaseAdmin = createAdminClient()
  const { data: userData, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('auth_id', user.id)
    .single()

  if (error || !userData) {
    console.error('User profile lookup error:', error)
    return null
  }

  return userData
}

/**
 * Get current user or redirect to login
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return user
}

/**
 * Require student role or redirect
 */
export async function requireStudent(): Promise<User> {
  const user = await requireAuth()

  if (user.user_role !== 'student') {
    redirect(`/${user.user_role}`)
  }

  return user
}

/**
 * Require staff role or redirect
 */
export async function requireStaff(): Promise<User> {
  const user = await requireAuth()

  if (user.user_role !== 'staff') {
    redirect(`/${user.user_role}`)
  }

  return user
}

/**
 * Require admin role or redirect
 */
export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()

  if (user.user_role !== 'admin') {
    redirect(`/${user.user_role}`)
  }

  return user
}

/**
 * Check if user is authenticated (for client components)
 */
export async function checkAuth(): Promise<{ authenticated: boolean; role?: UserRole }> {
  const user = await getCurrentUser()

  if (!user) {
    return { authenticated: false }
  }

  return { authenticated: true, role: user.user_role }
}
