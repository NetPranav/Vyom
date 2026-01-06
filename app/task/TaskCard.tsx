import React from 'react';
import { MapPin, Clock, ArrowRight, IndianRupee, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

// 1. Updated Interface to include 'image'
export interface Task {
  id: number;
  title: string;
  description: string;
  budget: string | number; 
  tags: string;           
  priority: "STANDARD" | "URGENT";
  location_string: string; 
  created_at: string;
  status?: string;
  image?: string | null; // <--- ADDED THIS
}

interface TaskCardProps {
  task: Task; 
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [isPopupOpen, setIsPopupOpen] = React.useState(false);
  const budgetAmount = typeof task.budget === 'string' 
    ? parseFloat(task.budget).toFixed(0) 
    : task.budget;

  return (
    <div className="group relative w-full max-w-[320px] bg-white border-2 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-auto">
      
      {/* --- HEADER: Category & Priority --- */}
      <div className="flex justify-between items-start mb-4">
        <div className="inline-block border border-black px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-gray-50 truncate max-w-[120px]">
          {task.tags || "General"}
        </div>

        {task.priority === 'URGENT' ? (
          <div className="flex items-center gap-1 animate-pulse">
            <div className="w-2 h-2 bg-red-600 rounded-full" />
            <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Urgent</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 opacity-50">
             <div className="w-2 h-2 bg-gray-400 rounded-full" />
             <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Standard</span>
          </div>
        )}
      </div>

      {/* --- 🖼️ IMAGE SECTION (New) --- */}
      {task.image && (
        <div className="w-full h-40 mb-4 border-2 border-black overflow-hidden relative bg-gray-100">
           {/* Image: Grayscale normally, Color on hover */}
           <img 
             src={task.image} 
             alt="Task Attachment" 
             className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
           />
           <div className="absolute top-2 right-2 bg-black text-white p-1">
             <ImageIcon size={12} />
           </div>
        </div>
      )}

      {/* --- BODY: Title & Desc --- */}
      <div className="flex-grow">
        <h3 className="font-serif text-2xl font-black leading-[0.9] mb-3 uppercase italic break-words line-clamp-2">
          {task.title}
        </h3>
        <div className="w-12 h-0.5 bg-black mb-3" />
        <p className="font-mono text-xs text-gray-600 leading-relaxed line-clamp-3">
          {task.description}
        </p>
      </div>

      {/* --- META: Stats Grid --- */}
      <div className="mt-4 py-3 border-y-2 border-black border-dashed grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider mb-1">Budget</span>
          <div className="flex items-center">
            <IndianRupee size={14} strokeWidth={3} />
            <span className="text-xl font-black">{budgetAmount}</span>
          </div>
        </div>

        <div className="flex flex-col items-end text-right">
          <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider mb-1">Location</span>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold uppercase truncate max-w-[100px]" title={task.location_string}>
                {task.location_string || "Remote"}
            </span>
            <MapPin size={12} />
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-3">
             <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400">
                <Clock size={12} />
                <span>Posted {formatTimeAgo(task.created_at)}</span>
             </div>
        </div>

        <Link href={`/tasks/${task.id}`}>
            <button className="w-full bg-black text-white py-3 px-4 flex items-center justify-between group/btn hover:bg-gray-900 transition-colors">
            <span className="font-mono text-sm font-bold uppercase tracking-widest">View Gig</span>
            <div className="bg-white text-black p-1 rounded-sm group-hover/btn:translate-x-1 transition-transform">
                <ArrowRight size={14} strokeWidth={3} />
            </div>
            </button>
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;