"use client"

import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { logout } from "@/store/slices/auth-slice"
import { Button } from "@/components/ui/button"
import { LayoutList } from "lucide-react"

export default function NavBar() {
  const user = useSelector((s: RootState) => s.auth.user)
  const dispatch = useDispatch()

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/projects" className="flex items-center gap-2">
          <LayoutList className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-blue-600">Mini Project Manager</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/projects" className="text-sm text-slate-600 hover:text-slate-900">
            Projects
          </Link>
          {user ? (
            <>
              <span className="text-sm text-slate-500 hidden sm:inline">{user.email}</span>
              <Button variant="outline" className="border-slate-300 bg-transparent" onClick={() => dispatch(logout())}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
