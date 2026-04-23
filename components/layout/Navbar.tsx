"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Svg from "../svg/svg";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const path = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", route: "/" },
    { label: "Leads", route: "/leads" },
    { label: "Settings", route: "/settings" },
  ];

  const isActive = (route: string) => path === route;

  return (
    <nav className="w-full bg-white border-b border-zinc-200 px-4 sm:px-8 h-16 flex items-center sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        
        {/* LOGO SECTION */}
        <div
          className="flex items-center gap-2.5 cursor-pointer shrink-0 active:scale-95 transition-transform"
          onClick={() => router.push("/")}
        >
          <Svg />
          <span className="font-bold text-zinc-900 tracking-tight text-base sm:text-lg">
            Lead Management
          </span>
        </div>

        {/* DESKTOP MIDDLE NAVIGATION */}
        <div className="hidden md:flex items-center gap-3  p-1">
          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => router.push(item.route)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                isActive(item.route)
                  ? "bg-black text-white shadow-sm border border-zinc-200"
                  : "text-zinc-900 hover:text-zinc-900 hover:bg-white/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* RIGHT ACTIONS: USER & LOGOUT */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* User Name Badge - Desktop/Tablet */}
          <div className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-full">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border border-zinc-200 shadow-sm">
               <UserIcon className="w-3.5 h-3.5 text-zinc-600" />
            </div>
            <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">
              {/* Yeh portion Settings page ke update() se auto-sync hota hai */}
              {session?.user?.name || "Admin"}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-zinc-600 hover:text-red-600 border border-transparent hover:border-red-100 hover:bg-red-50/50 rounded-xl transition-all group"
          >
            <span className="hidden xs:inline">Logout</span>
            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* MOBILE TOGGLE */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors border border-zinc-200"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-zinc-200 p-4 md:hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 z-40">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.route}
                onClick={() => {
                  router.push(item.route);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-4 rounded-xl text-sm font-bold transition-all ${
                  isActive(item.route)
                    ? "bg-zinc-950 text-white shadow-lg"
                    : "text-zinc-600 bg-zinc-50 hover:bg-zinc-100"
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Mobile User Info Footer */}
            <div className="mt-2 p-4 bg-zinc-50 rounded-xl flex items-center justify-between border border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-zinc-200 shadow-sm">
                  <UserIcon className="w-4 h-4 text-zinc-600" />
                </div>
                <span className="text-sm font-bold text-zinc-700">
                  {session?.user?.name || "Admin"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;