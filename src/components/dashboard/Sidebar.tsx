"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  LayoutGrid,
  Users,
  LogOut,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", icon: LayoutGrid, label: "Dashboard" },
  { href: "/admin/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/admin/applications", icon: FileText, label: "Applications" },
  { href: "/admin/applicants", icon: Users, label: "Legacy Applicants" },
];

function NavContent({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  return (
    <>
      <div className="flex items-center gap-2 px-2 py-4">
        <Briefcase className="h-8 w-8 text-blue-900" />
        <h1 className="text-xl font-bold tracking-tighter text-slate-900">HR Platform</h1>
      </div>
      <nav className="mt-8 flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:text-blue-900",
                  {
                    "bg-slate-50 text-blue-900 shadow-sm ring-1 ring-inset ring-blue-100":
                      pathname === item.href,
                  }
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
        <Link
          href="/admin/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Link>
      </div>
    </>
  );
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-64 flex-col border-r border-slate-200 bg-white p-4 lg:flex">
        <NavContent />
      </aside>

      {/* Mobile Header & Sidebar */}
      <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <Briefcase className="h-7 w-7 text-blue-900" />
          <h1 className="text-lg font-bold tracking-tighter text-slate-900">HR Platform</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      {/* Mobile Sidebar Panel */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-64 transform flex-col border-r border-slate-200 bg-white p-4 transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-2 py-4">
            <Briefcase className="h-8 w-8 text-blue-900" />
            <h1 className="text-xl font-bold tracking-tighter text-slate-900">HR Platform</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <nav className="mt-8 flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-blue-50 hover:text-blue-900",
                    {
                      "bg-blue-50 text-blue-900 shadow-sm ring-1 ring-inset ring-blue-200":
                        usePathname() === item.href,
                    }
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto">
          <Link
            href="/admin/login"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
