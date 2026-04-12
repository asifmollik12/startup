"use client";
import { Bell, Search, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  return (
    <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 flex-shrink-0">
      <div className="relative w-72">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="search"
          placeholder="Search content..."
          className="w-full bg-gray-800 border border-gray-700 text-sm text-gray-300 placeholder-gray-500 pl-9 pr-4 py-2 rounded-lg focus:outline-none focus:border-brand-red transition-colors"
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-red rounded-full" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-700">
          <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center">
            <User size={15} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white leading-tight">Admin</p>
            <p className="text-[10px] text-gray-500">admin@gmail.com</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-1"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}
