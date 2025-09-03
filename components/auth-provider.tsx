"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { login } from "@/store/slices/auth-slice"
import { authApi, getAuthToken, removeAuthToken } from "@/lib/api"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch()

    useEffect(() => {
        const initAuth = async () => {
            const token = getAuthToken()

            if (token) {
                try {
                    // Verify token is still valid by calling /me endpoint
                    const response = await authApi.me()

                    // Token is valid, restore user session
                    dispatch(login({
                        email: response.user.email,
                        id: response.user.id,
                    }))
                } catch (error) {
                    console.error('Token validation failed:', error)
                    // Token is invalid, remove it
                    removeAuthToken()
                }
            }
        }

        initAuth()
    }, [dispatch])

    return <>{children}</>
}