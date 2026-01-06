"use client"
import React, { useEffect, useState } from 'react';
import { Search, MapPin, Shield, Clock, Plus, Globe } from 'lucide-react';
import gsap from 'gsap';

export default function NeoHelperDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let ctx = gsap.context(() => {
      gsap.from(".header-text", { y: 50, opacity: 0, duration: 0.8, ease: "power4.out" });
      gsap.from(".stat-box", { x: -20, opacity: 0, stagger: 0.2, delay: 0.5 });
      gsap.from(".grid-line", { scaleX: 0, stagger: 0.1, duration: 1 });
    });
    return () => ctx.revert();
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white text-black font-mono p-4 md:p-10 selection:bg-black selection:text-white">
      
      {/* --- TOP HEADER SECTION --- */}
      <header className="border-b-4 border-black pb-8 mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="max-w-2xl">
          <p className="font-black text-xl mb-2 tracking-tighter uppercase">SkillSync</p>
          <h1 className="header-text text-6xl md:text-8xl font-black leading-none uppercase italic">
            Helper <br /> Dashboard.
          </h1>
          <div className="mt-4 text-gray-600 font-bold uppercase tracking-widest text-sm">
            Your mission control. <br />
            EST. 2026 // INDORE
          </div>
        </div>
        
        {/* 3D Brain/Mesh Placeholder Animation */}
        <div className="hidden md:block w-64 h-64 border-2 border-dashed border-black rounded-full relative overflow-hidden animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center">
                <Globe size={120} strokeWidth={0.5} className="rotate-12" />
            </div>
        </div>
      </header>

      {/* --- STATS BAR --- */}
      <div className="mb-10">
        <p className="font-black uppercase mb-2 text-sm tracking-widest">Stats Bar</p>
        <div className="grid grid-cols-1 md:grid-cols-3 border-4 border-black">
          <StatBox label="Weekly Payout" value="₹8,420" />
          <StatBox label="Trust Score" value="98/100" hasIcon />
          <StatBox label="Active Tasks" value="3" last />
        </div>
      </div>

      {/* --- SEARCH & RADIUS BAR --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-4 border-black mb-10 overflow-hidden">
        <div className="p-4 border-b-4 md:border-b-0 md:border-r-4 border-black flex items-center justify-between">
           <span className="text-[10px] font-black uppercase">Scan Radius</span>
           <span className="bg-black text-white px-2 py-1 text-xs font-bold">5 KM</span>
        </div>
        <div className="md:col-span-3 p-4 flex items-center gap-4">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="QUERY DATABASE ..." 
            className="w-full outline-none font-bold placeholder:text-gray-300 uppercase" 
          />
          <Clock size={20} className="text-gray-400" />
        </div>
      </div>

      {/* --- MAIN CONTENT: MAP & GIGS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT: LIVE OPPORTUNITY MAP */}
        <div className="lg:col-span-8">
          <h3 className="font-black uppercase mb-4 tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full animate-ping" />
            Live Opportunity Map
          </h3>
          <div className="border-4 border-black h-[500px] relative bg-[#fafafa] overflow-hidden group">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-10" 
                 style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            
            {/* Radar Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-40 h-40 border-2 border-black rounded-full animate-ping opacity-20" />
                <div className="w-60 h-60 border-2 border-black rounded-full animate-ping delay-700 opacity-10" />
                <div className="w-2 h-2 bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Floating Task Points */}
            <MapPoint top="20%" left="15%" />
            <MapPoint top="40%" left="70%" />
            <MapPoint top="80%" left="30%" />
            <MapPoint top="10%" left="60%" />
          </div>
        </div>

        {/* RIGHT: ACTIVE GIGS */}
        <div className="lg:col-span-4 relative">
          <h3 className="font-black uppercase mb-4 tracking-widest">Active Gigs</h3>
          <div className="space-y-6">
             <GigCard category="Manual Labor" title="Fix Leaking Pipe" location="Sector 74 • 1.2 km away" />
             <GigCard category="Manual Labor" title="Review React Code" location="Sector 74 • 1.2 km away" />
             <GigCard category="English Tutor" title="English Tutor" location="Sector 74 • 1.2 km away" />
          </div>

          {/* Floating Go Offline Button */}
          <button className="fixed bottom-10 right-10 bg-black text-white px-6 py-4 font-black uppercase flex items-center gap-3 hover:bg-gray-800 transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.2)]">
            <Plus size={20} />
            Go Offline
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatBox({ label, value, last, hasIcon }) {
  return (
    <div className={`p-6 bg-white ${!last ? 'md:border-r-4 border-black border-b-4 md:border-b-0' : ''}`}>
      <p className="text-[10px] font-black uppercase text-gray-500 mb-2">{label}</p>
      <div className="flex items-center gap-4">
        <h2 className="text-4xl font-black tracking-tighter">{value}</h2>
        {hasIcon && <div className="flex gap-1"><Shield size={20} fill="black" /><Shield size={20} fill="black" /></div>}
      </div>
    </div>
  );
}

function GigCard({ category, title, location }) {
  return (
    <div className="border-4 border-black p-6 bg-white hover:bg-black hover:text-white transition-all cursor-pointer group">
       <div className="flex justify-between items-start mb-2">
         <span className="text-[10px] font-black uppercase border-2 border-black px-2 py-0.5 group-hover:border-white">{category}</span>
         <span className="text-3xl font-black italic">3</span>
       </div>
       <h4 className="text-xl font-black uppercase leading-tight">{title}</h4>
       <p className="text-xs font-bold mt-1 text-gray-500 group-hover:text-gray-300 uppercase">{location}</p>
    </div>
  );
}

function MapPoint({ top, left }) {
  return (
    <div className="absolute w-4 h-4 bg-white border-2 border-black group-hover:scale-125 transition-transform" style={{ top, left }}>
       <div className="w-1.5 h-1.5 bg-black m-0.5" />
    </div>
  );
}