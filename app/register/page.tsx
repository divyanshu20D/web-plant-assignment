"use client"

import type React from "react"

import Link from "next/link"
import { useDispatch } from "react-redux"
import { register } from "@/store/slices/auth-slice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import NavBar from "@/components/nav-bar"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(register({ email }))
    router.push("/projects")
  }

  return (
    <main>
      <NavBar />
      <div className="mx-auto max-w-md px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Create account</CardTitle>
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
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
            <p className="text-sm text-slate-600 mt-3">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
