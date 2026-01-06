"use client";

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { MapPin, Search, Plus } from 'lucide-react';

// --- 3D ELEMENT: RETRO WIREFRAME ---
const RetroWireframe = () => {
  const meshRef = useRef<any>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
      <mesh ref={meshRef} scale={[1.5, 1.5, 1.5]}>
        <icosahedronGeometry args={[1.5, 1]} />
        {/* Wireframe is the key to the 'Legacy' look */}
        <meshBasicMaterial color="black" wireframe />
      </mesh>
    </Float>
  );
};

export default function TaskFeed() {
  const [radius, setRadius] = useState(5);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Brutal slide-up animation
      gsap.from(".legacy-reveal", { 
        y: 100, 
        opacity: 0, 
        duration: 0.8, 
        stagger: 0.1,
        ease: "power2.out" 
      });
      
      // Draw lines animation (optional flair)
      gsap.from(".divider-line", { scaleX: 0, duration: 1, delay: 0.5, ease: "power3.inOut" });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black font-serif selection:bg-black selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <div className="w-full border-b-4 border-black">
        <div className="container mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between">
            
            {/* Text Content */}
            <div className="w-full md:w-1/2 z-10">
                <div className="legacy-reveal inline-block border border-black px-2 py-1 text-xs font-mono uppercase tracking-widest mb-4 bg-white">
                    Vol. 1 — Local Edition
                </div>
                <h1 className="legacy-reveal text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
                    THE <br/>
                    TASK <br/>
                    FEED.
                </h1>
                <p className="legacy-reveal text-lg md:text-xl font-mono max-w-md border-l-2 border-black pl-4">
                    Connecting neighborhood supply with local demand. 
                    <br />
                    <span className="text-sm mt-2 block opacity-60">EST. 2026 // INDORE</span>
                </p>
            </div>

            {/* 3D Canvas - Wireframe aesthetic */}
            <div className="w-full md:w-1/2 h-[300px] md:h-[400px] relative grayscale contrast-150">
                <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={1} />
                    <RetroWireframe />
                </Canvas>
            </div>
        </div>
      </div>

      {/* --- CONTROLS SECTION --- */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        
        {/* Control Bar - Boxy Layout */}
        <div className="legacy-reveal border-2 border-black p-0 flex flex-col md:flex-row shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
            
            {/* Radius Control */}
            <div className="w-full md:w-1/3 p-6 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col justify-center">
                <label className="font-mono text-xs uppercase tracking-widest mb-2 flex justify-between">
                    <span>Scan Radius</span>
                    <span className="bg-black text-white px-1">{radius} KM</span>
                </label>
                <input 
                    type="range" 
                    min="1" max="20" 
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="w-full h-1 bg-black appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:rounded-none"
                />
            </div>

            {/* Search Input */}
            <div className="w-full md:w-2/3 relative flex items-center">
                <div className="absolute left-6 pointer-events-none">
                    <Search className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <input 
                    type="text" 
                    placeholder="QUERY DATABASE..." 
                    className="w-full h-full py-6 pl-16 pr-6 bg-transparent outline-none font-mono text-lg placeholder-black/40 uppercase"
                />
            </div>
        </div>

        {/* --- FEED PLACEHOLDER (The "Newspaper" Slot) --- */}
        <div className="legacy-reveal mt-12 w-full min-h-[500px] border-2 border-black border-dashed p-8 flex flex-col items-center justify-center text-center">
            <h3 className="font-serif text-3xl italic font-bold mb-2">No Tasks Loaded</h3>
            <div className="divider-line w-24 h-1 bg-black mb-4"></div>
            <p className="font-mono text-sm max-w-sm">
                The component &lt;TaskCard /&gt; has not been mounted to the DOM. 
                Use the fab button to generate new entries.
            </p>
        </div>

      </div>

      {/* --- FAB (Square, brutalist) --- */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-black text-white w-16 h-16 md:w-auto md:h-auto md:px-8 md:py-4 flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,1),8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1),4px_4px_0px_0px_rgba(0,0,0,1)] transition-all border-2 border-black">
            <Plus size={24} strokeWidth={3} />
            <span className="hidden md:block font-mono font-bold uppercase tracking-wider">Post Task</span>
        </button>
      </div>

    </div>
  );
}