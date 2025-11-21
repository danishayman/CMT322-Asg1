// components/ToastProvider.tsx
"use client"

import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    // You can customize the position and options here
    <Toaster
        toastOptions={{
            success: {
            style: {
                background: 'white',
                border: '1px solid green'
            },
            position: "top-center",
            
            },
            error: {
            style: {
                background: 'white',
                border: '1px solid red'
            },
            position: "top-center",
            },
        }}
        reverseOrder={false}
    />
  )
}