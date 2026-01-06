"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Github, Twitter, Instagram, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-white text-black border-t-2 border-black font-sans">
      
      {/* --- SECTION 1: BIG CTA --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b-2 border-black">
        <div className="p-8 md:p-16 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col justify-center bg-yellow-400">
            <h2 className="font-serif text-5xl md:text-6xl font-black leading-none mb-6">
                READY TO <br/> GET STARTED?
            </h2>
            <p className="font-mono text-sm font-bold mb-8 max-w-sm">
                Join 120+ students and neighbors in Indore helping each other out.
            </p>
            <div className="flex gap-4">
                <Link href="/task" className="bg-black text-white px-8 py-4 font-mono font-bold uppercase hover:bg-white hover:text-black border-2 border-black transition-colors">
                    Post a Task
                </Link>
                <Link href="/task" className="bg-white text-black px-8 py-4 font-mono font-bold uppercase hover:bg-black hover:text-white border-2 border-black transition-colors">
                    Earn Money
                </Link>
            </div>
        </div>

        {/* Newsletter / dense info block */}
        <div className="p-8 md:p-16 bg-white flex flex-col justify-between">
            <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest border border-black px-2 py-1 mb-4 inline-block">
                    Newsletter
                </span>
                <h3 className="font-serif text-3xl font-bold mb-4">Weekly Updates.</h3>
                <div className="flex border-2 border-black">
                    <input 
                        type="email" 
                        placeholder="EMAIL ADDRESS" 
                        className="flex-1 p-4 outline-none font-mono text-sm uppercase placeholder:text-gray-400 bg-transparent"
                    />
                    <button className="bg-black text-white px-6 font-mono font-bold hover:bg-gray-800 transition-colors">
                        SUBMIT
                    </button>
                </div>
            </div>
            
            <div className="mt-12">
                 <p className="font-mono text-xs text-gray-500 mb-2">CURRENT BUILD: v1.0.4-alpha</p>
                 <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-black">
                    <div className="w-[85%] h-full bg-green-500"></div>
                 </div>
                 <p className="font-mono text-[10px] text-right mt-1">SYSTEM STABLE</p>
            </div>
        </div>
      </div>

      {/* --- SECTION 2: LINKS GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-black border-b-2 border-black">
        
        {/* Col 1: Brand */}
        <div className="p-8 flex flex-col justify-between h-48 md:h-64">
            <Link href="/" className="font-serif font-black text-2xl tracking-tighter">
                PocketFix.
            </Link>
            <p className="font-mono text-xs text-gray-500">
                A hyperlocal skills marketplace for the modern neighborhood.
            </p>
        </div>

        {/* Col 2: Platform */}
        <div className="p-8 flex flex-col h-48 md:h-64">
            <h4 className="font-mono text-xs font-bold uppercase mb-6 text-gray-400">Platform</h4>
            <ul className="space-y-4 font-bold text-sm">
                <li><Link href="/feed" className="hover:underline">Task Feed</Link></li>
                <li><Link href="/dashboard" className="hover:underline">Helper Dashboard</Link></li>
                <li><Link href="/leaderboard" className="hover:underline">Leaderboard</Link></li>
                <li><Link href="/login" className="hover:underline">Login / Sign Up</Link></li>
            </ul>
        </div>

        {/* Col 3: Legal */}
        <div className="p-8 flex flex-col h-48 md:h-64">
            <h4 className="font-mono text-xs font-bold uppercase mb-6 text-gray-400">Legal</h4>
            <ul className="space-y-4 font-mono text-xs">
                <li><Link href="#" className="hover:underline">TERMS OF SERVICE</Link></li>
                <li><Link href="#" className="hover:underline">PRIVACY POLICY</Link></li>
                <li><Link href="#" className="hover:underline">COMMUNITY GUIDELINES</Link></li>
                <li><Link href="#" className="hover:underline">DISPUTE RESOLUTION</Link></li>
            </ul>
        </div>

        {/* Col 4: Connect */}
        <div className="p-8 flex flex-col h-48 md:h-64">
             <h4 className="font-mono text-xs font-bold uppercase mb-6 text-gray-400">Social</h4>
             <div className="flex gap-4">
                <a href="#" className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                    <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                    <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                    <Github size={18} />
                </a>
             </div>
        </div>

      </div>

      {/* --- SECTION 3: BOTTOM BAR --- */}
      <div className="bg-black text-white p-4 md:px-8 flex flex-col md:flex-row justify-between items-center font-mono text-xs">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
            <span className="opacity-50">© 2026 POCKETFIX INC.</span>
            <span className="hidden md:inline text-gray-700">|</span>
            <span className="opacity-50">ALL RIGHTS RESERVED.</span>
        </div>

        <div className="flex items-center gap-2">
            <span>MADE WITH</span>
            <Heart size={10} className="text-red-500 fill-current" />
            <span>IN INDORE</span>
            <MapPin size={10} className="ml-1" />
        </div>
      </div>

    </footer>
  );
}