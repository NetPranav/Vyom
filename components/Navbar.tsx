"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, LayoutGrid, ClipboardList } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b-2 border-black h-16 flex items-stretch text-black font-sans">
        
        {/* 1. BRAND LOGO (Left) */}
        <div className="flex-shrink-0 flex items-center px-6 border-r-2 border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer group">
          <Link href="/" className="font-serif font-black text-2xl tracking-tighter">
            PocketFix.
          </Link>
        </div>

        {/* 2. MARQUEE (Middle - Hidden on smaller screens) */}
        <div className="hidden lg:flex flex-1 overflow-hidden relative items-center bg-gray-50 border-r-2 border-black">
          <div className="whitespace-nowrap animate-marquee font-mono text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
            <span className="mx-4">/// SYSTEM STATUS: ONLINE</span>
            <span className="mx-4">/// LOCATION: INDORE [22.7° N]</span>
            <span className="mx-4">/// FIXING TAPS & BUGS SINCE 2026</span>
            <span className="mx-4">/// LIVE TASKS: 14</span>
            <span className="mx-4">/// COMMISSION: 12%</span>
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
        </div>

        {/* 3. DESKTOP NAVIGATION (Right) */}
        <div className="flex items-stretch ml-auto lg:ml-0">
          
          {/* Link: Task Feed */}
          <Link 
            href="/task" 
            className="hidden md:flex items-center gap-2 px-6 font-mono text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors border-r-2 border-black"
          >
            <ClipboardList size={14} />
            <span className="hidden xl:inline">Task </span>Feed
          </Link>

          {/* Link: Helper Dashboard */}
          <Link 
            href="/dashboard" 
            className="hidden md:flex items-center gap-2 px-6 font-mono text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors border-r-2 border-black"
          >
            <LayoutGrid size={14} />
            Dashboard
          </Link>

          {/* Link: Login */}
          <Link 
            href="/login" 
            className="hidden md:flex items-center px-6 font-mono text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors border-r-2 border-black"
          >
            Log In
          </Link>

          {/* Action: Post Task */}
          <Link 
            href="/create-task" 
            className="hidden md:flex items-center gap-2 px-8 bg-black text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Post <span className="hidden xl:inline">Task</span> <ArrowUpRight size={16} />
          </Link>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex md:hidden items-center justify-center px-6 hover:bg-black hover:text-white transition-colors border-l-2 border-black md:border-l-0"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* 4. MOBILE MENU DROPDOWN */}
      {isMenuOpen && (
        <div className="fixed top-16 left-0 w-full bg-white border-b-2 border-black z-40 flex flex-col md:hidden animate-in slide-in-from-top-5 duration-200 h-[calc(100vh-64px)] overflow-y-auto">
          
          <div className="p-4 border-b border-black bg-gray-100 font-mono text-xs uppercase text-gray-600">
            Directory // PocketFix v1.0
          </div>

          <Link href="/feed" className="p-6 border-b border-black font-serif text-2xl font-bold hover:bg-black hover:text-white transition-colors flex justify-between items-center group">
            Task Feed
            <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          
          <Link href="/dashboard" className="p-6 border-b border-black font-serif text-2xl font-bold hover:bg-black hover:text-white transition-colors flex justify-between items-center group">
            Helper Dashboard
            <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link href="/create-task" className="p-6 border-b border-black font-serif text-2xl font-bold hover:bg-black hover:text-white transition-colors flex justify-between items-center group">
            Post a Request
            <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <div className="mt-auto p-6 bg-black text-white">
            <Link href="/login" className="block text-center font-mono font-bold uppercase tracking-widest py-3 border border-white hover:bg-white hover:text-black transition-colors">
              Login Account
            </Link>
          </div>
        </div>
      )}
    </>
  );
}