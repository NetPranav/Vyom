"use client"
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, IndianRupee, MapPin, Clock, ArrowRight, ShieldCheck, Zap, Info, Maximize2 } from 'lucide-react';
import { Task } from './TaskCard'; // Path apne hisab se change karein

interface TaskDetailPopupProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onAccept: (id: number) => void;
}

const TaskDetailPopup: React.FC<TaskDetailPopupProps> = ({ task, isOpen, onClose, onAccept }) => {
    const budgetAmount = typeof task.budget === 'string'
        ? parseFloat(task.budget).toFixed(0)
        : task.budget;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">

                    {/* --- BACKDROP: Glassmorphism style --- */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-white/90 backdrop-blur-md"
                    />

                    {/* --- POPUP CONTENT --- */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        className="relative w-full max-w-4xl bg-white border-[4px] border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
                    >

                        {/* --- LEFT SIDE: IMAGE (if exists) --- */}
                        {task.image ? (
                            <div className="w-full md:w-1/2 h-64 md:h-auto border-b-[4px] md:border-b-0 md:border-r-[4px] border-black bg-gray-100 relative">
                                <img
                                    src={task.image}
                                    alt={task.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-4 left-4 bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest italic">
                                    Visual_Attachment_01
                                </div>
                            </div>
                        ) : (
                            <div className="hidden md:flex w-1/2 bg-gray-50 items-center justify-center border-r-[4px] border-black">
                                <div className="text-gray-200 uppercase font-black text-6xl rotate-90 tracking-tighter opacity-20 select-none pointer-events-none">
                                    NO_MEDIA
                                </div>
                            </div>
                        )}

                        {/* --- RIGHT SIDE: CONTENT --- */}
                        <div className="w-full md:w-1/2 flex flex-col p-6 md:p-10 overflow-y-auto custom-scrollbar">

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 border-2 border-black p-1 hover:bg-black hover:text-white transition-colors z-20"
                            >
                                <X size={20} strokeWidth={4} />
                            </button>

                            {/* Tags & Status */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest italic">
                                    {task.tags || "General"}
                                </div>
                                {task.priority === 'URGENT' && (
                                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest animate-pulse">
                                        ● Priority_Urgent
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-[0.8] mb-8 tracking-tighter"
                                style={{ fontFamily: 'serif' }}>
                                {task.title}.
                            </h2>

                            {/* Stats Box */}
                            <div className="grid grid-cols-2 border-4 border-black divide-x-4 divide-black mb-8">
                                <div className="p-4 flex flex-col bg-gray-50">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Payout</span>
                                    <div className="flex items-center">
                                        <IndianRupee size={20} strokeWidth={4} />
                                        <span className="text-3xl font-black tracking-tighter">{budgetAmount}</span>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col">
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Time Elapsed</span>
                                    <span className="text-xl font-black italic">NEW_POST</span>
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="flex-grow mb-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <Info size={14} strokeWidth={3} />
                                    <h4 className="font-black uppercase tracking-widest text-[11px]">Mission Description</h4>
                                </div>
                                <div className="border-l-[6px] border-black pl-6 py-2">
                                    <p className="font-mono text-xs md:text-sm leading-relaxed text-gray-700">
                                        {task.description}
                                    </p>
                                </div>
                            </div>

                            {/* Location & Meta */}
                            <div className="mb-10 bg-gray-100 border-2 border-black border-dashed p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <MapPin size={18} strokeWidth={3} />
                                    <span className="font-black uppercase text-xs tracking-tight">{task.location_string || "Remote/Indore"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                                    <Clock size={12} />
                                    <span>ID: #{task.id}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => onAccept(task.id)}
                                    className="bg-black text-white p-5 font-black uppercase text-xs flex items-center justify-center gap-3 shadow-[8px_8px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all group"
                                >
                                    <Zap size={18} fill="white" className="group-hover:scale-125 transition-transform" />
                                    Confirm Gig
                                </button>
                                <button
                                    onClick={onClose}
                                    className="border-4 border-black p-5 font-black uppercase text-xs hover:bg-gray-100 transition-colors"
                                >
                                    Decline
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TaskDetailPopup;