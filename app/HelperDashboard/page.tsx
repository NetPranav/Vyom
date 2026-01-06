"use client"
import React, { useEffect, useState } from 'react';
import { Search, Shield, Clock, Plus, Globe, Briefcase, User, Phone, CheckCircle } from 'lucide-react';
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
    status: "OPEN" | "ASSIGNED" | "COMPLETED"; // Enforce specific statuses
    budget: string;
    // New fields for the Dashboard to show who took the job
    assignee_name?: string; 
    assignee_phone?: string;
}

export default function NeoHelperDashboard() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // State for Data
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [acceptedGigs, setAcceptedGigs] = useState<Task[]>([]);
    const [postedGigs, setPostedGigs] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    function getInitials(name: string | undefined) {
        return name ? name.charAt(0).toUpperCase() : "U";
    }

    // FETCH DATA
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('accessToken'); // Ensure key matches your login logic
                if (!token) {
                    router.push('/login');
                    return;
                }

                // Make sure your Backend 'api/dashboard/data/' returns 'assignee_name' & 'assignee_phone' for posted gigs
                const response = await axios.get('http://127.0.0.1:8000/api/dashboard/data/', {
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

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-white text-black font-mono p-4 md:p-10 selection:bg-black selection:text-white">
            <Navbar Options1={"HOME"} Options2={"TASK FEED"} Path1={"/"} Path2={"/task"} />

            {/* --- TOP HEADER SECTION --- */}
            <header className="border-b-2 border-black pb-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-16">
                <div className="max-w-2xl animate-content">
                    <div className="border border-black inline-block px-2 py-0.5 text-[10px] mb-4 uppercase tracking-[0.2em] font-black shadow-[2px_2px_0px_black]">
                        VOL. 1 — LOCAL EDITION
                    </div>

                    <h1 className="header-text text-6xl md:text-9xl font-black leading-[0.85] uppercase italic tracking-tighter"
                        style={{ fontFamily: 'serif' }}>
                        HELPER<br />DASHBOARD.
                    </h1>

                    {/* --- USER PROFILE SECTION --- */}
                    <div className="mt-8 flex items-center gap-4 border-l-4 border-black pl-6 py-2 bg-gray-50 max-w-md">
                        
                        {/* Avatar Circle */}
                        <div className="relative w-16 h-16 shrink-0">
                            <div className="w-full h-full rounded-full border-[3px] border-black bg-black text-white flex items-center justify-center text-3xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] overflow-hidden">
                                {profile?.avatar ? (
                                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{getInitials(profile?.username)}</span>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>

                        {/* Username */}
                        <div>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">
                                Current Operator
                            </p>
                            <h2 className="text-3xl font-black uppercase leading-none tracking-tight">
                                {profile?.username || "GUEST_USER"}
                            </h2>
                            <p className="text-[10px] font-bold uppercase mt-1">
                                ID: {profile?.id ? `#00${profile.id}` : "---"} // STATUS: ONLINE
                            </p>
                        </div>
                    </div>
                </div>

                {/* Wireframe Brain/Globe */}
                <div className="hidden md:flex w-56 h-56 border border-black rounded-full items-center justify-center relative overflow-hidden bg-gray-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <Globe size={120} strokeWidth={0.5} className="animate-[spin_20s_linear_infinite] opacity-80" />
                </div>
            </header>

            {/* --- STATS BAR --- */}
            <div className="mb-10">
                <p className="font-black uppercase mb-2 text-[10px] tracking-[0.3em]">Stats Bar</p>
                <div className="grid grid-cols-1 md:grid-cols-3 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <StatBox
                        label="Wallet Balance"
                        value={loading ? "..." : `₹${parseFloat(profile?.wallet_balance || "0").toFixed(0)}`}
                    />
                    <StatBox
                        label="Trust Score"
                        value={loading ? "..." : `${profile?.trust_score || 0}/100`}
                        hasIcon
                    />
                    <StatBox
                        label="Active Gigs"
                        value={loading ? "..." : String(acceptedGigs.length)}
                        last
                    />
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* LEFT: ACCEPTED GIGS (Tasks I am doing) */}
                <div className="lg:col-span-8">
                    <h3 className="font-black uppercase mb-4 tracking-widest flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                        Accepted Gigs (My Tasks)
                    </h3>

                    <div className="border-[3px] border-black min-h-[400px] bg-white p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]">
                        {loading ? (
                            <p>Loading data...</p>
                        ) : acceptedGigs.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 min-h-[300px]">
                                <Briefcase size={48} />
                                <p className="mt-4 font-bold uppercase">No accepted gigs yet</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {acceptedGigs.map((task) => (
                                    <GigCard
                                        key={task.id}
                                        status={task.status}
                                        title={task.title}
                                        location={task.location_string}
                                        count={`₹${parseFloat(task.budget).toFixed(0)}`}
                                        isMyTask={true} // I am the worker
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: POSTED GIGS (Tasks I created) */}
                <div className="lg:col-span-4 relative">
                    <h3 className="font-black uppercase mb-4 tracking-widest text-xs px-2 flex items-center gap-2">
                        <User size={12} /> My Posted Gigs
                    </h3>

                    <div className="space-y-4">
                        {loading ? <p>Loading...</p> : postedGigs.length === 0 ? (
                            <p className="text-xs text-gray-400 uppercase font-bold p-4 border border-dashed border-gray-300">
                                You haven't posted any gigs.
                            </p>
                        ) : (
                            postedGigs.map((task) => (
                                <GigCard
                                    key={task.id}
                                    status={task.status}
                                    title={task.title}
                                    location={task.location_string}
                                    count={`ID:${task.id}`}
                                    // Pass assignee info to display if assigned
                                    assigneeName={task.assignee_name}
                                    assigneePhone={task.assignee_phone}
                                    isMyTask={false} // I am the owner
                                />
                            ))
                        )}
                    </div>

                    <button 
                        onClick={() => router.push('/task')}
                        className="w-full mt-8 bg-black text-white p-5 font-black uppercase text-sm flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 active:shadow-none"
                    >
                        <Plus size={18} strokeWidth={4} />
                        Post New Gig
                    </button>
                </div>
            </div>

            {/* Footer Logo */}
            <div className="fixed bottom-6 left-6 w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                N
            </div>
        </div>
    );
}

// --- REUSED COMPONENTS ---

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

// ✅ UPDATED GIG CARD TO SHOW ASSIGNEE DETAILS
interface GigCardProps {
    status: string;
    title: string;
    location: string;
    count: string;
    assigneeName?: string;
    assigneePhone?: string;
    isMyTask: boolean; // True if I am the worker, False if I am the owner
}

function GigCard({ status, title, location, count, assigneeName, assigneePhone, isMyTask }: GigCardProps) {
    return (
        <div className="border-[3px] border-black p-6 bg-white transition-all cursor-pointer group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[-2px] translate-y-[-2px] hover:translate-x-0 hover:translate-y-0 relative overflow-hidden">
            
            <div className="flex justify-between items-start mb-2 relative z-10">
                <span className={`text-[9px] font-black uppercase border-2 border-black px-2 py-0.5 
                    ${status === 'OPEN' ? 'bg-yellow-200 text-black' : 
                      status === 'ASSIGNED' ? 'bg-green-600 text-white border-green-800' : 'bg-gray-200'}`}>
                    {status}
                </span>
                <span className="text-xl font-black italic leading-none">{count}</span>
            </div>
            
            <h4 className="text-xl font-black uppercase leading-tight italic relative z-10" style={{ fontFamily: 'serif' }}>{title}</h4>
            <p className="text-[10px] font-bold mt-2 text-gray-400 uppercase tracking-widest relative z-10">{location}</p>

            {/* --- 👇 THIS SHOWS IF YOU ARE THE OWNER AND TASK IS ASSIGNED 👇 --- */}
            {!isMyTask && status === 'ASSIGNED' && assigneeName && (
                <div className="mt-4 pt-3 border-t-2 border-black border-dashed bg-blue-50 -mx-6 -mb-6 p-6">
                    <p className="text-[10px] font-black uppercase text-blue-800 mb-1 flex items-center gap-1">
                        <CheckCircle size={10} /> Mission Accepted By:
                    </p>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-lg font-black uppercase">{assigneeName}</p>
                            <p className="text-xs font-mono text-gray-600 flex items-center gap-1 mt-1">
                                <Phone size={12} /> {assigneePhone || "No Phone"}
                            </p>
                        </div>
                        <a href={`tel:${assigneePhone}`} className="bg-black text-white px-3 py-1 text-[10px] font-bold uppercase hover:bg-green-600">
                            Call Now
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}