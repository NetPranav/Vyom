"use client"
import React, { useEffect, useState } from 'react';
import { Search, Shield, Clock, Plus, Globe, Briefcase, User, Phone, CheckCircle, X, Mail, AlertTriangle, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import Navbar from '@/components/NavbarForOther';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// --- Interfaces ---
interface UserProfile {
    username: string;
    trust_score: number;
    wallet_balance: string;
    active_gigs_count: number;
    avatar?: string;
    id?: number;
}

interface Task {
    id: number;
    title: string;
    location_string: string;
    status: "OPEN" | "ASSIGNED" | "IN_REVIEW" | "COMPLETED"; // Added IN_REVIEW
    budget: string;
    
    // Assignee Info
    assignee_name?: string;
    assignee_phone?: string;
    assignee_email?: string; // Added Email
    
    // Logic flags
    is_submitted_by_helper?: boolean; // True if helper clicked "Mark Completed"
}

export default function NeoHelperDashboard() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Data State
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [acceptedGigs, setAcceptedGigs] = useState<Task[]>([]);
    const [postedGigs, setPostedGigs] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [selectedTask, setSelectedTask] = useState<Task | null>(null); // For Owner Review
    const [isProcessing, setIsProcessing] = useState(false);

    function getInitials(name: string | undefined) {
        return name ? name.charAt(0).toUpperCase() : "U";
    }

    // FETCH DATA
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/data/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { user_profile, accepted_gigs, posted_gigs } = response.data;
            setProfile(user_profile);
            setAcceptedGigs(accepted_gigs);
            setPostedGigs(posted_gigs);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [router]);

    // ANIMATION
    useEffect(() => {
        setMounted(true);
        let ctx = gsap.context(() => {
            gsap.from(".header-text", { y: 50, opacity: 0, duration: 0.8, ease: "power4.out" });
            gsap.from(".stat-box", { y: 20, opacity: 0, stagger: 0.1, delay: 0.3 });
        });
        return () => ctx.revert();
    }, [loading]);

    // --- HANDLERS ---

    // 1. HELPER: Mark Task as Completed
    const handleHelperMarkComplete = async (taskId: number) => {
        const token = localStorage.getItem('accessToken');
        try {
            // Call API to update status to "IN_REVIEW"
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}/submit/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Work Submitted! Waiting for owner verification.");
            fetchData(); // Refresh data
        } catch (error) {
            alert("Failed to submit work.");
        }
    };

    // 2. OWNER: Verify & Close Task
    const handleOwnerVerify = async (taskId: number, decision: 'approve' | 'reject') => {
        setIsProcessing(true);
        const token = localStorage.getItem('accessToken');
        try {
            if (decision === 'approve') {
                // Endpoint to mark as COMPLETED and pay user
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}/approve/`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Task Verified & Closed!");
            } else {
                // Endpoint to reset task to OPEN and penalize user
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}/reject/`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Work Rejected. Task is now OPEN again.");
            }
            setSelectedTask(null);
            fetchData();
        } catch (error) {
            alert("Action failed. Check console.");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-white text-black font-mono p-4 md:p-10 selection:bg-black selection:text-white relative">
            <Navbar Options1={"HOME"} Options2={"TASK FEED"} Path1={"/"} Path2={"/task"} />

            {/* --- HEADER --- */}
            <header className="border-b-2 border-black pb-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-16">
                <div className="max-w-2xl animate-content">
                    <div className="border border-black inline-block px-2 py-0.5 text-[10px] mb-4 uppercase tracking-[0.2em] font-black shadow-[2px_2px_0px_black]">
                        VOL. 1 — LOCAL EDITION
                    </div>
                    <h1 className="header-text text-6xl md:text-9xl font-black leading-[0.85] uppercase italic tracking-tighter" style={{ fontFamily: 'serif' }}>
                        HELPER<br />DASHBOARD.
                    </h1>
                    {/* Profile Section */}
                    <div className="mt-8 flex items-center gap-4 border-l-4 border-black pl-6 py-2 bg-gray-50 max-w-md">
                        <div className="relative w-16 h-16 shrink-0">
                            <div className="w-full h-full rounded-full border-[3px] border-black bg-black text-white flex items-center justify-center text-3xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] overflow-hidden">
                                {profile?.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : <span>{getInitials(profile?.username)}</span>}
                            </div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Current Operator</p>
                            <h2 className="text-3xl font-black uppercase leading-none tracking-tight">{profile?.username || "GUEST"}</h2>
                            <p className="text-[10px] font-bold uppercase mt-1">ID: {profile?.id ? `#00${profile.id}` : "---"} // STATUS: ONLINE</p>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex w-56 h-56 border border-black rounded-full items-center justify-center relative overflow-hidden bg-gray-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <Globe size={120} strokeWidth={0.5} className="animate-[spin_20s_linear_infinite] opacity-80" />
                </div>
            </header>

            {/* --- STATS --- */}
            <div className="mb-10">
                <p className="font-black uppercase mb-2 text-[10px] tracking-[0.3em]">Stats Bar</p>
                <div className="grid grid-cols-1 md:grid-cols-3 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <StatBox label="Wallet Balance" value={loading ? "..." : `₹${parseFloat(profile?.wallet_balance || "0").toFixed(0)}`} />
                    <StatBox label="Trust Score" value={loading ? "..." : `${profile?.trust_score || 0}/100`} hasIcon />
                    <StatBox label="Active Gigs" value={loading ? "..." : String(acceptedGigs.length)} last />
                </div>
            </div>

            {/* --- CONTENT GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* 1. LEFT: GIGS I ACCEPTED (I am Helper) */}
                <div className="lg:col-span-8">
                    <h3 className="font-black uppercase mb-4 tracking-widest flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" /> Accepted Gigs (My Tasks)
                    </h3>
                    <div className="border-[3px] border-black min-h-[400px] bg-white p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]">
                        {acceptedGigs.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 min-h-[300px]">
                                <Briefcase size={48} />
                                <p className="mt-4 font-bold uppercase">No accepted gigs yet</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {acceptedGigs.map((task) => (
                                    <GigCard
                                        key={task.id}
                                        task={task}
                                        isMyTask={true}
                                        onHelperAction={() => handleHelperMarkComplete(task.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. RIGHT: GIGS I POSTED (I am Owner) */}
                <div className="lg:col-span-4 relative">
                    <h3 className="font-black uppercase mb-4 tracking-widest text-xs px-2 flex items-center gap-2">
                        <User size={12} /> My Posted Gigs
                    </h3>
                    <div className="space-y-4">
                        {postedGigs.length === 0 ? (
                            <p className="text-xs text-gray-400 uppercase font-bold p-4 border border-dashed border-gray-300">You haven't posted any gigs.</p>
                        ) : (
                            postedGigs.map((task) => (
                                <GigCard
                                    key={task.id}
                                    task={task}
                                    isMyTask={false}
                                    onCardClick={() => {
                                        // Only open detailed modal if assigned or in review
                                        if (task.status === 'ASSIGNED' || task.status === 'IN_REVIEW') {
                                            setSelectedTask(task);
                                        }
                                    }}
                                />
                            ))
                        )}
                    </div>
                    <button onClick={() => router.push('/task')} className="w-full mt-8 bg-black text-white p-5 font-black uppercase text-sm flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px]">
                        <Plus size={18} strokeWidth={4} /> Post New Gig
                    </button>
                </div>
            </div>

            {/* --- MODAL: OWNER REVIEW --- */}
            {selectedTask && (
                <OwnerReviewModal 
                    task={selectedTask} 
                    onClose={() => setSelectedTask(null)}
                    onAction={handleOwnerVerify}
                    isProcessing={isProcessing}
                />
            )}
            
            <div className="fixed bottom-6 left-6 w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">N</div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function StatBox({ label, value, last, hasIcon }: any) {
    return (
        <div className={`p-8 bg-white flex flex-col justify-center ${!last ? 'md:border-r-[3px] border-black border-b-[3px] md:border-b-0' : ''} stat-box`}>
            <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">{label}</p>
            <div className="flex items-center justify-between">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">{value}</h2>
                {hasIcon && <div className="flex gap-1"><Shield size={20} fill="black" /><Shield size={20} fill="black" /></div>}
            </div>
        </div>
    );
}

// ✅ UPDATED GIG CARD
interface GigCardProps {
    task: Task;
    isMyTask: boolean;
    onHelperAction?: () => void;
    onCardClick?: () => void;
}

function GigCard({ task, isMyTask, onHelperAction, onCardClick }: GigCardProps) {
    const isClickable = !isMyTask && (task.status === 'ASSIGNED' || task.status === 'IN_REVIEW');

    return (
        <div 
            onClick={isClickable ? onCardClick : undefined}
            className={`border-[3px] border-black p-6 bg-white transition-all relative overflow-hidden group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                ${isClickable ? 'cursor-pointer hover:bg-yellow-50 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]' : ''}`}
        >
            <div className="flex justify-between items-start mb-2 relative z-10">
                <span className={`text-[9px] font-black uppercase border-2 border-black px-2 py-0.5 
                    ${task.status === 'OPEN' ? 'bg-yellow-200 text-black' : 
                      task.status === 'IN_REVIEW' ? 'bg-blue-600 text-white animate-pulse' :
                      task.status === 'ASSIGNED' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
                    {task.status.replace('_', ' ')}
                </span>
                <span className="text-xl font-black italic leading-none">
                    {isMyTask ? `₹${parseFloat(task.budget).toFixed(0)}` : `ID:${task.id}`}
                </span>
            </div>
            
            <h4 className="text-xl font-black uppercase leading-tight italic relative z-10" style={{ fontFamily: 'serif' }}>
                {task.title}
            </h4>
            <p className="text-[10px] font-bold mt-2 text-gray-400 uppercase tracking-widest relative z-10">
                {task.location_string}
            </p>

            {/* --- HELPER VIEW: Mark Complete Button --- */}
            {isMyTask && task.status === 'ASSIGNED' && (
                <div className="mt-4 pt-4 border-t-2 border-black border-dashed">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onHelperAction && onHelperAction(); }}
                        className="w-full bg-green-600 text-white border-2 border-black py-2 font-black uppercase text-xs shadow-[4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={14} /> Mark Completed
                    </button>
                </div>
            )}
            {isMyTask && task.status === 'IN_REVIEW' && (
                 <div className="mt-4 pt-4 border-t-2 border-black border-dashed text-center">
                    <p className="text-xs font-bold text-blue-600 uppercase flex items-center justify-center gap-2">
                        <Clock size={14} /> Waiting for Owner Approval
                    </p>
                 </div>
            )}

            {/* --- OWNER VIEW: Small Hint --- */}
            {!isMyTask && task.status === 'IN_REVIEW' && (
                 <div className="mt-4 pt-4 border-t-2 border-black border-dashed">
                    <p className="text-xs font-black text-red-600 uppercase flex items-center gap-2 animate-bounce">
                        <AlertTriangle size={14} /> Action Required
                    </p>
                 </div>
            )}
        </div>
    );
}

// ✅ NEW MODAL: OWNER REVIEW & DETAILS
interface ModalProps {
    task: Task;
    onClose: () => void;
    onAction: (id: number, decision: 'approve' | 'reject') => void;
    isProcessing: boolean;
}

function OwnerReviewModal({ task, onClose, onAction, isProcessing }: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border-[4px] border-black p-8 max-w-lg w-full shadow-[16px_16px_0px_0px_rgba(255,255,255,0.2)] relative flex flex-col gap-6">
                
                <button onClick={onClose} className="absolute top-4 right-4 bg-black text-white p-1 hover:bg-red-600 transition-colors">
                    <X size={20} />
                </button>

                <div className="border-b-2 border-black pb-4">
                    <h2 className="text-3xl font-black uppercase leading-none italic" style={{ fontFamily: 'serif' }}>Mission Control</h2>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Task ID: #{task.id}</p>
                </div>

                {/* --- ASSIGNEE DETAILS --- */}
                <div className="bg-gray-100 p-4 border-2 border-black">
                    <h3 className="font-black uppercase text-sm mb-3 flex items-center gap-2">
                        <User size={16} /> Operative Details
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between border-b border-gray-300 pb-1">
                            <span className="text-xs font-mono text-gray-500 uppercase">Name</span>
                            <span className="text-sm font-bold uppercase">{task.assignee_name || "Unknown"}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pb-1">
                            <span className="text-xs font-mono text-gray-500 uppercase">Phone</span>
                            <span className="text-sm font-bold font-mono">{task.assignee_phone || "Hidden"}</span>
                        </div>
                        <div className="flex justify-between pb-1">
                            <span className="text-xs font-mono text-gray-500 uppercase">Email</span>
                            <span className="text-sm font-bold font-mono lowercase">{task.assignee_email || "Hidden"}</span>
                        </div>
                    </div>
                </div>

                {/* --- ACTION SECTION --- */}
                <div className="text-center">
                    {task.status === 'IN_REVIEW' || task.is_submitted_by_helper ? (
                        <>
                            <div className="bg-yellow-100 p-3 border-2 border-black mb-4 flex items-center gap-3">
                                <AlertTriangle className="text-yellow-600" />
                                <p className="text-left text-xs font-bold uppercase leading-tight">
                                    Operative marked this task as complete. Verify the work before releasing funds.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    disabled={isProcessing}
                                    onClick={() => onAction(task.id, 'reject')}
                                    className="border-2 border-black py-4 font-black uppercase text-xs hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                                >
                                    Not Completed
                                    <span className="block text-[8px] font-normal mt-1 opacity-70">(Deduct Points)</span>
                                </button>
                                <button 
                                    disabled={isProcessing}
                                    onClick={() => onAction(task.id, 'approve')}
                                    className="bg-black text-white py-4 font-black uppercase text-xs hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin"/> : <CheckCircle size={16} />}
                                    Approve Work
                                    <span className="block text-[8px] font-normal mt-1 opacity-70">(Close Task)</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 p-4 text-gray-400">
                            <Clock className="mx-auto mb-2" />
                            <p className="text-xs font-bold uppercase">Work in Progress</p>
                            <p className="text-[10px] uppercase">You can verify once the operative submits the work.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}