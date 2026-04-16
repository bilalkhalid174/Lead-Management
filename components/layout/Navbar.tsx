"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Svg from "../svg/svg";

const Navbar = () => {
  const router = useRouter();
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItem = (label: string, route: string) => {
    const isActive = path === route;
    return (
      <button
        onClick={() => {
          router.push(route);
          setIsOpen(false);
        }}
        className={`relative text-sm font-medium transition-all duration-200 py-1 ${
          isActive
            ? "text-gray-900"
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        {label}
        {/* Subtle active indicator underline */}
        {isActive && (
          <span className="absolute -bottom-4.25 left-0 right-0 h-0.5 bg-gray-900 hidden sm:block" />
        )}
      </button>
    );
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-4 sm:px-8 h-16 flex items-center sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        
        {/* LOGO SECTION */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => router.push("/")}
        >
          <div className="transition-transform duration-200 group-hover:scale-110">
            <Svg />
          </div>
          <span className="text-base sm:text-lg font-semibold tracking-tight text-gray-900">
            Lead Management
          </span>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden sm:flex items-center gap-8">
          {navItem("Dashboard", "/")}
          {navItem("Leads", "/leads")}
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="sm:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-100 p-4 space-y-3 shadow-xl sm:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => { router.push("/"); setIsOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${path === "/" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => { router.push("/leads"); setIsOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${path === "/leads" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}
            >
              Leads
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;