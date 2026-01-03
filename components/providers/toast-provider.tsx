'use client'

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      toastOptions={{
        success: {
          style: {
            background: 'white',
            border: '1px solid green',
          },
          position: 'top-center',
        },
        error: {
          style: {
            background: 'white',
            border: '1px solid red',
          },
          position: 'top-center',
        },
      }}
      reverseOrder={false}
    />
  )
}
