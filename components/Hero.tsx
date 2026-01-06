"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { ArrowRight, Globe, ArrowDown, MapPin } from 'lucide-react';

// --- 3D COMPONENT: RETRO WIREFRAME SPHERE ---
const RetroWireframe = () => {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Constant rotation
      meshRef.current.rotation.x += 0.002;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
      <mesh ref={meshRef} scale={[2.4, 2.4, 2.4]}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="black" wireframe wireframeLinewidth={2} />
      </mesh>
    </Float>
  );
};

export default function Hero() {
  const containerRef = useRef(null);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text Reveal (Staggered up)
      gsap.from(".hero-line", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.1
      });
      
      // 2. Border Reveal (Expand width)
      gsap.from(".divider-line", {
        scaleX: 0,
        duration: 1.2,
        ease: "expo.out",
        delay: 0.5
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full border-b-2 border-black bg-white text-black mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-4rem)]">
        
        {/* --- LEFT COLUMN (Typography) --- */}
        <div className="lg:col-span-7 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-black p-6 md:p-12 relative">
          
          {/* Top Metadata Row */}
          <div className="flex justify-between font-mono text-xs font-bold uppercase tracking-widest border-b-2 border-black pb-4 mb-8 text-gray-500">
            <span className="flex items-center gap-2"><MapPin size={12}/> INDORE, INDIA</span>
            <span>EST. 2026</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-0 z-10 my-auto">
            <div className="overflow-hidden">
              <h1 className="hero-line font-serif text-6xl md:text-8xl xl:text-9xl font-black leading-[0.85] tracking-tighter">
                LOCAL
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 className="hero-line font-serif text-6xl md:text-8xl xl:text-9xl font-black leading-[0.85] tracking-tighter flex items-center gap-4">
                SKILLS <span className="hidden md:block h-4 flex-grow bg-black mt-4"></span>
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 className="hero-line font-serif text-6xl md:text-8xl xl:text-9xl font-black leading-[0.85] tracking-tighter italic text-gray-400">
                MARKET.
              </h1>
            </div>
          </div>

          {/* Description & CTA */}
          <div className="mt-12 max-w-lg">
            <div className="divider-line w-full h-0.5 bg-black mb-6 origin-left"></div>
            <p className="hero-line font-mono text-sm md:text-base leading-relaxed mb-8 text-gray-700">
              PocketFix is a decentralized ledger for micro-tasks. We connect neighbors who need help with students ready to work. 
              <br/><br/>
              <strong>// STATUS:</strong> 12 Helpers Online Nearby.
            </p>
            
            <div className="hero-line flex flex-col sm:flex-row gap-4">
              <Link href="/task" className="group flex items-center justify-center gap-4 bg-black text-white px-8 py-4 font-mono font-bold uppercase hover:bg-white hover:text-black border-2 border-black transition-all">
                <span>Post Request</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/feed" className="flex items-center justify-center gap-4 px-8 py-4 font-mono font-bold uppercase border-2 border-black hover:bg-black hover:text-white transition-all">
                Browse Feed
              </Link>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (Visuals) --- */}
        <div className="lg:col-span-5 relative bg-white flex flex-col min-h-[50vh] lg:min-h-auto">
          
          {/* Header Cell */}
          <div className="h-14 border-b-2 border-black flex items-center px-6 font-mono text-xs font-bold justify-between bg-gray-50">
            <span>FIGURE 1.1 — NETWORK VISUALIZATION</span>
            <Globe size={16} />
          </div>
          
          {/* 3D Canvas Area */}
          <div className="flex-1 relative overflow-hidden grayscale">
             {/* Technical Grid Background */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
             </div>
             
             <Canvas camera={{ position: [0, 0, 6] }}>
                <ambientLight intensity={1} />
                <RetroWireframe />
             </Canvas>

             {/* Floating Labels (Decorative) */}
             <div className="absolute top-4 left-4 font-mono text-[10px] bg-black text-white px-2 py-1">
                RENDER_MODE: WIREFRAME
             </div>
          </div>

          {/* Bottom Statistics Grid */}
          <div className="h-auto border-t-2 border-black grid grid-cols-2">
             <div className="p-6 border-r-2 border-black hover:bg-black hover:text-white transition-colors group cursor-default">
                <h3 className="font-serif text-3xl md:text-4xl font-bold group-hover:text-white">14</h3>
                <p className="font-mono text-[10px] uppercase mt-1 text-gray-500 group-hover:text-gray-300">New Tasks Today</p>
             </div>
             <div className="p-6 hover:bg-black hover:text-white transition-colors group cursor-default">
                <h3 className="font-serif text-3xl md:text-4xl font-bold group-hover:text-white">15m</h3>
                <p className="font-mono text-[10px] uppercase mt-1 text-gray-500 group-hover:text-gray-300">Avg. Response Time</p>
             </div>
          </div>
        </div>

      </div>
      
      {/* Scroll Indicator (Absolute Bottom) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white border-2 border-black rounded-full p-2 animate-bounce hidden md:block z-20">
        <ArrowDown size={20} />
      </div>
    </section>
  );
}