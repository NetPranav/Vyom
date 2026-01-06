"use client";

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { Search, Plus, Loader2 } from 'lucide-react';

// Components
import CreateTask from '@/app/task/CreateTask';
import TaskCard, { Task } from './TaskCard'; // ✅ Import Task Interface
import Navbar from '@/components/Navbar'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// --- 3D ELEMENT ---
const RetroWireframe = () => (
  <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
    <mesh scale={[1.5, 1.5, 1.5]}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshBasicMaterial color="black" wireframe />
    </mesh>
  </Float>
);

export default function TaskFeed() {
  const containerRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // ✅ FIX: State uses 'Task[]' instead of 'TaskCardProps[]'
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. FETCH TASKS
  const fetchTasks = async (query = "") => {
    setLoading(true);
    try {
      const url = `${API_URL}/api/tasks/?search=${query}`;
      const res = await fetch(url);
      
      if (!res.ok) throw new Error("Failed to fetch");
      
      const data = await res.json();
      setTasks(data); 
    } catch (err) {
      console.error("Feed Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const ctx = gsap.context(() => {
      gsap.from(".legacy-reveal", { y: 100, opacity: 0, duration: 0.8, stagger: 0.1 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    const timeoutId = setTimeout(() => fetchTasks(q), 500);
    return () => clearTimeout(timeoutId);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white text-black font-serif relative">
      <Navbar /> 

      {/* HEADER SECTION */}
      <div className="w-full border-b-4 border-black mt-16">
        <div className="container mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 z-10">
            <h1 className="legacy-reveal text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6 uppercase">
              The <br /> Task <br /> Feed.
            </h1>
            <p className="legacy-reveal font-mono text-sm uppercase tracking-widest max-w-md">
                Live requests from your neighborhood [Indore]. <br/>
                Connect. Fix. Earn.
            </p>
          </div>
          <div className="w-full md:w-1/2 h-[300px] relative grayscale contrast-150 hidden md:block">
            <Canvas camera={{ position: [0, 0, 5] }}><RetroWireframe /></Canvas>
          </div>
        </div>
      </div>

      {/* CONTROLS & FEED */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Search Bar */}
        <div className="legacy-reveal border-2 border-black p-0 flex flex-col md:flex-row shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white mb-8 transition-shadow focus-within:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-full relative flex items-center">
                <div className="absolute left-6 pointer-events-none text-gray-400">
                    <Search className="w-6 h-6" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="SEARCH TASKS..."
                  className="w-full h-full py-6 pl-16 pr-6 bg-transparent outline-none font-mono text-lg placeholder-gray-300 uppercase font-bold"
                />
            </div>
        </div>

        {/* Task Grid */}
        <div className="legacy-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-5 pb-24 border-2 border-black border-dashed min-h-[400px] bg-gray-50/50">
          {loading ? (
            <div className="col-span-full flex flex-col justify-center items-center h-64 gap-4 font-mono">
                <Loader2 className="w-10 h-10 animate-spin" />
                <span className="uppercase tracking-widest">Scanning Network...</span>
            </div>
          ) : tasks.length > 0 ? (
            
            // ✅ FIX: PASS SINGLE 'task' PROP
            tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))

          ) : (
            <div className="col-span-full flex flex-col items-center justify-center font-mono text-xl text-gray-400 h-64">
              <p>NO TASKS FOUND.</p>
              <button onClick={() => setIsPopupOpen(true)} className="text-sm mt-2 underline hover:text-black uppercase">
                Be the first to post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-40">
        <button 
            onClick={() => setIsPopupOpen(true)} 
            className="bg-black text-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black flex gap-2 items-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group"
        >
          <Plus size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
          <span className="hidden md:block font-mono font-bold uppercase">Post Request</span>
        </button>
      </div>

      {/* Popup */}
      {isPopupOpen && (
          <CreateTask 
            isOpen={isPopupOpen} 
            onClose={() => {
                setIsPopupOpen(false);
                fetchTasks(searchQuery);
            }}
          />
      )}
    </div>
  );
}