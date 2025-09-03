"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { logout } from "@/store/slices/auth-slice";
import { Button } from "@/components/ui/button";
import { LayoutList } from "lucide-react";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api";

export default function NavBar() {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with logout even if API call fails
    }

    dispatch(logout());
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    router.push("/login");
  };

  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <LayoutList className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-blue-600">
            Mini Project Manager
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/projects"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Projects
          </Link>
          {user ? (
            <>
              <span className="text-sm text-slate-500 hidden sm:inline">
                {user.email}
              </span>
              <ConfirmationDialog
                trigger={
                  <Button
                    variant="outline"
                    className="border-slate-300 bg-transparent"
                  >
                    Logout
                  </Button>
                }
                title="Confirm Logout"
                description="Are you sure you want to logout? You'll need to login again to access your projects."
                confirmText="Logout"
                onConfirm={handleLogout}
                variant="destructive"
              />
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
  );
}
