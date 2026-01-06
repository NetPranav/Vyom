"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, IndianRupee, MapPin, Zap, Calendar, Clock, Phone, Mail, CheckCircle } from 'lucide-react';
import { Task } from './TaskCard';
import axios from 'axios';

interface TaskDetailPopupProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
    onTaskAccepted: () => void; // To refresh feed after accept
}

const TaskDetailPopup: React.FC<TaskDetailPopupProps> = ({ task, isOpen, onClose, onTaskAccepted }) => {
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    // Reset state when popup opens/closes
    React.useEffect(() => {
        if(!isOpen) setSuccessMsg("");
    }, [isOpen]);

    const handleAcceptGig = async () => {
        if (!task) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            // Call the NEW backend endpoint
            await axios.post(`http://127.0.0.1:8000/api/tasks/${task.id}/claim/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setSuccessMsg("GIG ACCEPTED! CHECK DASHBOARD.");
            setTimeout(() => {
                onTaskAccepted(); // Refresh parent data
                onClose();        // Close popup
            }, 1500);

        } catch (error: any) {
            alert(error.response?.data?.error || "Failed to accept gig");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !task) return null;

    return (
        <AnimatePresence mode="wait">
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={onClose} className="absolute inset-0 bg-white/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-4xl bg-white border-[4px] border-black shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row max-h-[90vh] overflow-hidden"
                >
                    {/* Left: Image */}
                    <div className="w-full md:w-1/2 h-48 md:h-auto bg-gray-100 border-b-[4px] md:border-b-0 md:border-r-[4px] border-black relative">
                        {task.image ? (
                            <img src={task.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center font-black text-gray-300">NO IMAGE</div>
                        )}
                        {/* Status Tag */}
                        <div className="absolute top-4 left-4 bg-white border-2 border-black px-3 py-1 font-black text-xs uppercase tracking-widest">
                            {task.tags || "GIG"}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-black hover:text-white transition-colors">
                            <X size={24} />
                        </button>

                        <h2 className="text-4xl md:text-5xl font-black uppercase italic leading-[0.85] mb-6 tracking-tighter font-serif">
                            {task.title}
                        </h2>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="border-2 border-black p-3 bg-gray-50">
                                <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Payout</span>
                                <span className="text-2xl font-black flex items-center">
                                    <IndianRupee size={18} strokeWidth={3}/>{parseFloat(task.budget.toString()).toFixed(0)}
                                </span>
                            </div>
                            <div className="border-2 border-black p-3 bg-gray-50">
                                <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Deadline</span>
                                <span className="text-sm font-bold flex items-center gap-2">
                                    <Calendar size={14}/> {new Date(task.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="border-2 border-black p-3 bg-gray-50">
                                <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Duration</span>
                                <span className="text-sm font-bold flex items-center gap-2">
                                    <Clock size={14}/> {task.estimated_duration || "1 Hour"}
                                </span>
                            </div>
                             <div className="border-2 border-black p-3 bg-gray-50">
                                <span className="text-[10px] font-black uppercase text-gray-400 block mb-1">Location</span>
                                <span className="text-sm font-bold flex items-center gap-2 truncate" title={task.location_string}>
                                    <MapPin size={14}/> {task.location_string || "Remote"}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h3 className="font-black uppercase text-xs mb-2">Mission Brief:</h3>
                            <p className="font-mono text-xs leading-relaxed text-gray-600">
                                {task.description}
                            </p>
                        </div>

                        {/* Contact Info (Only show if needed, usually hidden until accept in some apps, but requested here) */}
                        <div className="mb-8 p-4 bg-yellow-50 border-2 border-black border-dashed">
                             <div className="flex items-center gap-2 mb-1">
                                <Phone size={14}/> <span className="font-mono text-xs font-bold">{task.primary_phone || "Hidden"}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <Mail size={14}/> <span className="font-mono text-xs font-bold">{task.contact_email || "Hidden"}</span>
                             </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto space-y-3">
                            {successMsg ? (
                                <div className="bg-green-600 text-white p-4 font-black uppercase text-center animate-pulse flex items-center justify-center gap-2">
                                    <CheckCircle /> {successMsg}
                                </div>
                            ) : (
                                <button 
                                    onClick={handleAcceptGig}
                                    disabled={loading}
                                    className="w-full bg-black text-white p-4 font-black uppercase text-sm flex items-center justify-center gap-2 shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
                                >
                                    {loading ? "Processing..." : <><Zap size={18} fill="white" /> Accept Mission</>}
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TaskDetailPopup;