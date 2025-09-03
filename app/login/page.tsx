"use client"

import type React from "react"

import Link from "next/link"
import { useDispatch } from "react-redux"
import { login } from "@/store/slices/auth-slice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import NavBar from "@/components/nav-bar"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { authApi, setAuthToken, ApiError } from "@/lib/api"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await authApi.login(email, password)

      // Store the JWT token
      setAuthToken(response.token)

      // Update Redux state
      dispatch(login({
        email: response.user.email,
        id: response.user.id
      }))

      toast({
        title: "Success",
        description: "Logged in successfully",
      })

      router.push("/projects")
    } catch (error) {
      console.error('Login error:', error)

      let errorMessage = "Login failed"

      if (error instanceof ApiError) {
        errorMessage = error.message
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <NavBar />
      <div className="mx-auto max-w-md px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-3" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
            <p className="text-sm text-slate-600 mt-3">
              No account?{" "}
              <Link href="/register" className="text-blue-600">
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
