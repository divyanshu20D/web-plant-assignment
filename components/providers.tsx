"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "@/store"
import AuthProvider from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </Provider>
  )
}
