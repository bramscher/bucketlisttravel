"use client";

import { useState } from "react";
import Link from "next/link";
import { Globe, Heart, Compass, Camera, Map, Menu, X, LogOut, User } from "lucide-react";

interface HeaderProps {
  user?: { email: string; full_name?: string } | null;
  onSignOut?: () => void;
}

const navItems = [
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/dashboard", label: "Bucket List", icon: Heart },
  { href: "/trips/new", label: "Plan Trip", icon: Map },
  { href: "/memories", label: "Memories", icon: Camera },
];

export default function Header({ user, onSignOut }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <Globe
              size={28}
              className="text-brand-sky group-hover:text-brand-sky-dark transition-colors duration-200"
              strokeWidth={1.8}
            />
            <span className="font-heading text-2xl font-bold text-brand-ocean tracking-tight">
              Bucket List
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-brand-sky hover:bg-brand-bg transition-all duration-200 cursor-pointer"
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>

          {/* User / Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-bg">
                  <User size={14} className="text-brand-sky" />
                  <span className="text-sm font-medium text-brand-ocean">
                    {user.full_name || user.email}
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                  aria-label="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-semibold text-brand-sky hover:text-brand-sky-dark transition-colors duration-200 cursor-pointer"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-5 py-2 text-sm font-semibold text-white bg-brand-sky hover:bg-brand-sky-dark rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-brand-bg transition-colors duration-200 cursor-pointer"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden pb-4 animate-slide-down">
            <nav className="flex flex-col gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:text-brand-sky hover:bg-brand-bg transition-all duration-200 cursor-pointer"
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 pt-3 border-t border-slate-200">
              {user ? (
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="block px-4 py-3 text-center text-sm font-semibold text-white bg-brand-sky rounded-xl cursor-pointer"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
