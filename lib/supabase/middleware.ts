import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Helper function to create redirect with preserved cookies
  const redirectWithCookies = (url: URL) => {
    const redirectResponse = NextResponse.redirect(url)
    // Copy all cookies from supabaseResponse to preserve the session
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // Protected routes - redirect to login if not authenticated
  const protectedPaths = ['/student', '/staff', '/admin']
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return redirectWithCookies(url)
  }

  // If user is logged in and trying to access login page, redirect based on role
  if (user && request.nextUrl.pathname === '/login') {
    // Get user role from the users table
    const { data: userData } = await supabase
      .from('users')
      .select('user_role')
      .eq('auth_id', user.id)
      .single()

    if (userData) {
      const url = request.nextUrl.clone()
      switch (userData.user_role) {
        case 'student':
          url.pathname = '/student'
          break
        case 'staff':
          url.pathname = '/staff'
          break
        case 'admin':
          url.pathname = '/admin'
          break
        default:
          url.pathname = '/login'
      }
      return redirectWithCookies(url)
    }
  }

  // Role-based access control
  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('user_role')
      .eq('auth_id', user.id)
      .single()

    if (userData) {
      const role = userData.user_role
      const pathname = request.nextUrl.pathname

      // Students can only access /student routes
      if (role === 'student' && (pathname.startsWith('/staff') || pathname.startsWith('/admin'))) {
        const url = request.nextUrl.clone()
        url.pathname = '/student'
        return redirectWithCookies(url)
      }

      // Staff can only access /staff routes
      if (role === 'staff' && (pathname.startsWith('/student') || pathname.startsWith('/admin'))) {
        const url = request.nextUrl.clone()
        url.pathname = '/staff'
        return redirectWithCookies(url)
      }

      // Admin can access /admin routes only
      if (role === 'admin' && (pathname.startsWith('/student') || pathname.startsWith('/staff'))) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return redirectWithCookies(url)
      }
    }
  }

  return supabaseResponse
}
