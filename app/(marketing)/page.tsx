import Link from "next/link"
import NavBar from "@/components/nav-bar"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main>
      <NavBar />
      <section className="mx-auto max-w-5xl px-4 py-12 grid gap-6">
        <h1 className="text-3xl font-semibold text-pretty">Build and track projects with a clean, simple UI</h1>
        <p className="text-slate-600 max-w-prose">
          Sign in to manage your projects and tasks. Filter by status, sort by due date, and keep work moving.
        </p>
        <div>
          <Link href="/projects">
            <Button>Go to projects</Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
