import Link from "next/link";
import NavBar from "@/components/nav-bar";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main>
      <NavBar />
      <section className="mx-auto max-w-5xl px-4 py-12 grid gap-6">
        <h1 className="text-3xl font-semibold text-pretty">
          Build a simple task managing platform.
        </h1>
        <p className="text-slate-600 max-w-prose">
          Sign in to manage your projects and tasks.
        </p>
        <div>
          <Link href="/projects">
            <Button>Go to projects</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
