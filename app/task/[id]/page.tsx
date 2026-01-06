"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, MapPin, Calendar, Clock, IndianRupee, 
  User, MessageSquare, ShieldCheck, Loader2, Send 
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Types
interface Offer {
  id: number;
  helper_name: string;
  price_bid: number;
  message: string;
  created_at: string;
  status: string;
}

interface TaskDetails {
  id: number;
  title: string;
  description: string;
  budget: string;
  status: string;
  priority: string;
  location_string: string;
  deadline: string;
  created_at: string;
  image?: string;
  tags: string;
  owner_name: string; // Ensure your backend sends this, or use 'created_by.username'
  is_owner: boolean;  // Backend should tell us if I created this task
  offers: Offer[];    // List of offers received
}

export default function TaskDetailsPage() {
  const params = useParams(); // Get [id] from URL
  const router = useRouter();
  
  const [task, setTask] = useState<TaskDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Offer Form State
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Task Data on Load
  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await fetch(`${API_URL}/api/tasks/${params.id}/`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Task not found");
        
        const data = await res.json();
        setTask(data);
        // Pre-fill offer price with budget as suggestion
        setOfferPrice(data.budget); 
      } catch (error) {
        alert("Error loading task.");
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchTask();
  }, [params.id, router]);

  // 2. Handle "Make Offer" Submit
  const handleMakeOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${API_URL}/api/tasks/${params.id}/offer/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            price_bid: parseFloat(offerPrice),
            message: offerMessage
        })
      });

      if (res.ok) {
        alert("Offer Sent! The owner will see it in their dashboard.");
        setOfferMessage("");
        // Optionally refresh data to show your offer in the list
      } else {
        const err = await res.json();
        alert("Failed: " + JSON.stringify(err));
      }
    } catch (error) {
      alert("Network Error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-mono">LOADING DATA...</div>;
  if (!task) return null;

  return (
    <div className="min-h-screen bg-white text-black font-serif">
      <Navbar />

      <div className="container mx-auto px-4 py-8 pt-24">
        
        {/* Back Button */}
        <button onClick={() => router.back()} className="flex items-center gap-2 font-mono text-xs uppercase font-bold hover:underline mb-6">
            <ArrowLeft size={16} /> Back to Feed
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* LEFT COLUMN: Task Details */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Header */}
                <div>
                    <div className="flex gap-2 mb-4">
                        <span className="bg-black text-white px-2 py-1 text-[10px] font-mono uppercase tracking-widest">{task.tags || "GIG"}</span>
                        {task.priority === 'URGENT' && <span className="bg-red-600 text-white px-2 py-1 text-[10px] font-mono uppercase tracking-widest animate-pulse">URGENT</span>}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-6">{task.title}</h1>
                    
                    <div className="flex flex-wrap gap-6 font-mono text-xs text-gray-500 uppercase tracking-widest border-y-2 border-black py-4">
                        <div className="flex items-center gap-2"><MapPin size={16}/> {task.location_string}</div>
                        <div className="flex items-center gap-2"><Calendar size={16}/> Due: {new Date(task.deadline).toLocaleDateString()}</div>
                        <div className="flex items-center gap-2"><Clock size={16}/> Posted: {new Date(task.created_at).toLocaleDateString()}</div>
                    </div>
                </div>

                {/* Image (If exists) */}
                {task.image && (
                    <div className="w-full h-64 md:h-96 border-2 border-black p-2 bg-gray-100">
                        <img src={task.image} alt="Task" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                    </div>
                )}

                {/* Description */}
                <div>
                    <h3 className="font-mono text-xl font-bold uppercase mb-4 decoration-wavy underline">Mission Brief</h3>
                    <p className="font-sans text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">
                        {task.description}
                    </p>
                </div>

            </div>

            {/* RIGHT COLUMN: Action Panel */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white p-6">
                    
                    {/* Budget Display */}
                    <div className="text-center border-b-2 border-black border-dashed pb-6 mb-6">
                        <span className="font-mono text-xs uppercase text-gray-500">Target Budget</span>
                        <div className="flex items-center justify-center text-5xl font-black mt-2">
                            <IndianRupee size={32} strokeWidth={4} />
                            {parseFloat(task.budget).toFixed(0)}
                        </div>
                    </div>

                    {/* OWNER VIEW vs HELPER VIEW */}
                    {task.is_owner ? (
                        /* OWNER SEEING THEIR OWN TASK */
                        <div className="bg-gray-100 p-4 border-2 border-black text-center">
                            <ShieldCheck size={32} className="mx-auto mb-2"/>
                            <h3 className="font-bold uppercase">You Posted This</h3>
                            <p className="text-xs font-mono mt-2">Check the dashboard to see offers from helpers.</p>
                            <button 
                                onClick={() => router.push('/dashboard')}
                                className="w-full bg-black text-white py-3 mt-4 font-bold uppercase hover:bg-gray-800"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    ) : (
                        /* HELPER MAKING AN OFFER */
                        <form onSubmit={handleMakeOffer} className="space-y-4">
                            <div className="bg-yellow-100 p-3 border border-black text-xs font-mono mb-4">
                                <span className="font-bold">⚡ OPEN FOR BIDS:</span> Make a fair offer to win this gig.
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase mb-1">Your Price (₹)</label>
                                <input 
                                    type="number" 
                                    value={offerPrice}
                                    onChange={(e) => setOfferPrice(e.target.value)}
                                    className="w-full border-2 border-black p-3 font-bold text-lg focus:bg-gray-50 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase mb-1">Pitch / Message</label>
                                <textarea 
                                    rows={3}
                                    value={offerMessage}
                                    onChange={(e) => setOfferMessage(e.target.value)}
                                    placeholder="I can do this because..."
                                    className="w-full border-2 border-black p-3 font-medium text-sm focus:bg-gray-50 outline-none resize-none"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-gray-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="animate-spin"/> : <Send size={18} />}
                                {submitting ? "Sending..." : "Submit Offer"}
                            </button>
                        </form>
                    )}

                    {/* Safety Note */}
                    <div className="mt-6 pt-4 border-t-2 border-gray-100 text-center">
                        <p className="text-[10px] font-mono text-gray-400 uppercase">
                            Protected by PocketFix Escrow
                        </p>
                    </div>

                </div>
            </div>

        </div>
      </div>
    </div>
  );
}