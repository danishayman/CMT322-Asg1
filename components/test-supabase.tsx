// components/test-supabase.tsx
'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function TestSupabase() {
  useEffect(() => {
    async function testConnection() {
      const supabase = createClient()
      console.log('Testing Supabase connection...')
      
      // Test 1: Check if we can access the auth session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('Session:', session)
      if (sessionError) console.error('Session error:', sessionError)

      // Test 2: Try a simple query
      const { data, error } = await supabase
        .from('complaints')
        .select('id')
        .limit(1)
      
      console.log('Test query result:', { data, error })
    }

    testConnection()
  }, [])

  return <div>Check browser console for Supabase connection test results</div>
}