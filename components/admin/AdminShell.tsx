"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem("admin_auth") === "true";
    setAuthed(isAuth);
    if (!isAuth && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [pathname, router]);

  // Login page renders without the shell
  if (pathname === "/admin/login") {
    return <div className="bg-gray-950 min-h-screen">{children}</div>;
  }

  // Still checking auth
  if (authed === null) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <span className="w-6 h-6 border-2 border-gray-700 border-t-brand-red rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-950">{children}</main>
      </div>
    </div>
  );
}
