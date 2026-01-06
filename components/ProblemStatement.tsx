"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertTriangle, CheckCircle2, Clock, DollarSign, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Data: The "Frictions" we are solving
const PROBLEMS = [
  {
    id: "ERR_01",
    title: "Leaking Tap",
    context: "Plumber charges ₹500 visit fee.",
    solution: "Student Neighbor",
    price: "₹150",
    time: "20m"
  },
  {
    id: "ERR_02",
    title: "Sofa Moving",
    context: "Need 2 hands for 5 minutes.",
    solution: "Gym Rat nearby",
    price: "₹100",
    time: "10m"
  },
  {
    id: "ERR_03",
    title: "React Bug",
    context: "Stuck on deployment error.",
    solution: "CS Senior",
    price: "₹200",
    time: "30m"
  },
  {
    id: "ERR_04",
    title: "Math Homework",
    context: "Trigonometry is hard.",
    solution: "Top Topper",
    price: "₹300",
    time: "1h"
  }
];

export default function ProblemStatement() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the "Ticket" cards appearing
      gsap.from(".ticket-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white text-black border-b-2 border-black overflow-hidden relative">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[80vh]">
        
        {/* --- LEFT: NARRATIVE (35%) --- */}
        <div className="lg:col-span-4 p-8 md:p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-black flex flex-col justify-center bg-black text-white">
          <div className="mb-8">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 border border-gray-600 px-2 py-1">
              Section 02 // The Disconnect
            </span>
          </div>
          
          <h2 className="font-serif text-5xl md:text-6xl font-black leading-tight mb-6">
            TOO SMALL <br/> FOR PROS.
          </h2>
          <h2 className="font-serif text-5xl md:text-6xl font-black leading-tight text-gray-500 mb-8 italic">
            TOO HARD <br/> TO IGNORE.
          </h2>

          <p className="font-mono text-sm leading-relaxed text-gray-300 mb-8">
            Urban Life Error Log:<br/>
            Professionals have high "Visit Fees".<br/>
            Friends are busy.<br/>
            You are stuck.
            <br/><br/>
            PocketFix bridges the gap between "I need help" and "I can help".
          </p>

          <div className="mt-auto">
            <div className="h-px w-full bg-gray-700 mb-4"></div>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <AlertTriangle size={14} className="text-yellow-500" />
              <span>MARKET INEFFICIENCY DETECTED</span>
            </div>
          </div>
        </div>

        {/* --- RIGHT: INTERACTIVE TICKETS (65%) --- */}
        <div className="lg:col-span-8 bg-gray-50 relative flex flex-col">
          
          {/* Header */}
          <div className="h-16 border-b-2 border-black flex items-center justify-between px-6 bg-white">
            <span className="font-mono text-xs font-bold uppercase">Live Friction Log</span>
            <div className="flex gap-2">
               <span className="w-3 h-3 rounded-full bg-red-500 border border-black"></span>
               <span className="w-3 h-3 rounded-full bg-yellow-500 border border-black"></span>
               <span className="w-3 h-3 rounded-full bg-green-500 border border-black"></span>
            </div>
          </div>

          {/* Grid of Issues */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
            {PROBLEMS.map((item, index) => (
              <div 
                key={item.id} 
                className={`ticket-card group relative border-b-2 border-black ${index % 2 === 0 ? 'md:border-r-2' : ''} p-8 hover:bg-white transition-colors cursor-crosshair`}
              >
                {/* STATE 1: THE PROBLEM (Default) */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between group-hover:opacity-0 transition-opacity duration-300">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-red-600 font-bold border border-red-600 px-1">OPEN TICKET</span>
                    <span className="font-mono text-xs text-gray-400">{item.id}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl font-bold mb-2">{item.title}</h3>
                    <p className="font-mono text-xs text-gray-500">context: {item.context}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold mt-4">
                    <span className="underline decoration-2 decoration-red-500">Hover to Resolve</span>
                    <ArrowRight size={16} />
                  </div>
                </div>

                {/* STATE 2: THE SOLUTION (Hover) */}
                <div className="absolute inset-0 bg-black text-white p-8 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs text-green-400 font-bold border border-green-400 px-1">RESOLVED</span>
                    <CheckCircle2 size={16} className="text-green-400" />
                  </div>
                  
                  <div>
                     <p className="font-mono text-xs text-gray-400 mb-1">FIXED BY:</p>
                     <h3 className="font-serif text-2xl font-bold mb-4 text-white">{item.solution}</h3>
                     
                     <div className="grid grid-cols-2 gap-4 border-t border-gray-700 pt-4">
                        <div>
                            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1"><DollarSign size={12}/> COST</div>
                            <div className="font-mono text-lg font-bold text-green-400">{item.price}</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-1 text-gray-400 text-xs mb-1"><Clock size={12}/> TIME</div>
                            <div className="font-mono text-lg font-bold text-yellow-400">{item.time}</div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- TICKER TAPE FOOTER --- */}
      <div className="border-t-2 border-black bg-yellow-400 overflow-hidden py-3">
        <div className="animate-marquee whitespace-nowrap font-mono text-sm font-bold uppercase text-black">
          <span className="mx-8">/// WHO DO I CALL TO FIX A DOOR HANDLE?</span>
          <span className="mx-8">/// I NEED A GYM BUDDY</span>
          <span className="mx-8">/// WHO CAN REVIEW MY CV URGENTLY?</span>
          <span className="mx-8">/// MY SCOOTER BROKE DOWN 2KM AWAY</span>
          <span className="mx-8">/// WHO DO I CALL TO FIX A DOOR HANDLE?</span>
          <span className="mx-8">/// I NEED A GYM BUDDY</span>
          <span className="mx-8">/// WHO CAN REVIEW MY CV URGENTLY?</span>
        </div>
      </div>

    </section>
  );
}