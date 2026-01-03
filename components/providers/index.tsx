'use client'

import { ToastProvider } from './toast-provider'

interface ProvidersProps {
  children: React.ReactNode
}

/**
 * Root providers wrapper component
 * Add any client-side providers here (auth, theme, state management, etc.)
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <>
      <ToastProvider />
      {children}
    </>
  )
}
