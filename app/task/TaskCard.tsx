"use client";

import React from 'react';
import { MapPin, Clock, ArrowUpRight, Tag, AlertCircle } from 'lucide-react';

// Define the shape of the data this card expects
// This matches the fields we used in CreateTask
export interface TaskProps {
  id: string | number;
  title: string;
  description: string;
  budget: number;
  category: string;
  priority: "STANDARD" | "URGENT";
  location: string;
  distance?: string; // Optional, calculated by backend
  timePosted?: string;
}

export default function TaskCard(task:TaskProps) {
  const isUrgent = task.priority === "URGENT";

  return (
    <div className="group relative w-full bg-white border-2 border-black p-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      
      {/* --- DECORATIVE HEADER BAR --- */}
      <div className={`h-2 w-full border-b-2 border-black ${isUrgent ? 'bg-red-500' : 'bg-gray-200'}`}></div>

      <div className="p-5 flex flex-col h-full relative">
        
        {/* TOP ROW: Category & Priority */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1 border border-black px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-gray-100">
              <Tag size={10} /> {task.category}
            </span>
            {isUrgent && (
               <span className="inline-flex items-center gap-1 border border-black px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-red-500 text-white animate-pulse">
                 <AlertCircle size={10} /> URGENT
               </span>
            )}
          </div>
          <span className="font-mono text-[10px] text-gray-400 font-bold">{task.timePosted || 'JUST NOW'}</span>
        </div>

        {/* MAIN CONTENT */}
        <div className="mb-4">
          <h3 className="font-serif text-2xl font-black uppercase leading-none mb-2 line-clamp-2 group-hover:underline decoration-2 underline-offset-2">
            {task.title}
          </h3>
          <p className="font-mono text-xs text-gray-500 leading-relaxed line-clamp-2 uppercase">
            {task.description}
          </p>
        </div>

        {/* DETAILS GRID */}
        <div className="mt-auto border-t-2 border-black pt-4 grid grid-cols-2 gap-4">
          
          {/* Price Block */}
          <div>
            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Budget</span>
            <span className="font-mono text-xl font-bold block">₹{task.budget}</span>
          </div>

          {/* Location Block */}
          <div>
            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</span>
            <div className="flex items-center gap-1 font-mono text-xs font-bold truncate">
              <MapPin size={12} />
              <span className="truncate">{task.location}</span>
            </div>
            {task.distance && (
              <span className="text-[10px] text-gray-400 font-mono block mt-0.5">({task.distance} away)</span>
            )}
          </div>

        </div>

        {/* HOVER ACTION (Absolute) */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black text-white p-2 border border-black">
                <ArrowUpRight size={20} />
            </div>
        </div>

      </div>
    </div>
  );
}