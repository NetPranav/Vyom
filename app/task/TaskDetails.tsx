"use client"
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, IndianRupee, MapPin, Zap } from 'lucide-react';
import { Task } from './TaskCard';

interface TaskDetailPopupProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onAccept: (id: number) => void;
}

const TaskDetailPopup: React.FC<TaskDetailPopupProps> = ({ task, isOpen, onClose, onAccept }) => {
    // Esc key se close karne ke liye
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    {/* Backdrop - Simple Fade */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-white/80 backdrop-blur-sm"
                    />

                    {/* Content - No Layout Glitch */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative w-full max-w-4xl bg-white border-[4px] border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
                    >
                        {/* Left: Image */}
                        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 border-b-[4px] md:border-b-0 md:border-r-[4px] border-black">
                            {task.image ? (
                                <img src={task.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-black text-gray-300">NO_IMAGE</div>
                            )}
                        </div>

                        {/* Right: Info */}
                        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
                            <button onClick={onClose} className="absolute top-4 right-4 border-2 border-black p-1 hover:bg-black hover:text-white transition-colors">
                                <X size={20} strokeWidth={4} />
                            </button>

                            <h2 className="text-5xl font-black uppercase italic leading-none mb-6 tracking-tighter" style={{ fontFamily: 'serif' }}>
                                {task.title}
                            </h2>

                            <div className="grid grid-cols-2 border-2 border-black mb-6 divide-x-2 divide-black">
                                <div className="p-3">
                                    <span className="text-[10px] font-black uppercase block text-gray-400">Payout</span>
                                    <span className="text-2xl font-black flex items-center"><IndianRupee size={16}/>{task.budget}</span>
                                </div>
                                <div className="p-3">
                                    <span className="text-[10px] font-black uppercase block text-gray-400">Location</span>
                                    <span className="text-sm font-black truncate block">{task.location_string}</span>
                                </div>
                            </div>

                            <p className="font-mono text-xs leading-relaxed mb-8 flex-grow">{task.description}</p>

                            <div className="flex flex-col gap-3 mt-auto">
                                <button 
                                    onClick={() => onAccept(task.id)}
                                    className="bg-black text-white p-4 font-black uppercase text-xs flex items-center justify-center gap-2 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]"
                                >
                                    <Zap size={16} fill="white" /> Accept Mission
                                </button>
                                <button onClick={onClose} className="border-2 border-black p-4 font-black uppercase text-xs">Close</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TaskDetailPopup;