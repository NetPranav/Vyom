"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle } from 'lucide-react';

// Use Environment Variable (Fallback to localhost if missing)
// NOTE: In Next.js Client Components, variables must start with NEXT_PUBLIC_
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // New success state
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use the dynamic API_URL
      const response = await fetch(`${API_URL}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Save Tokens
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        
        // 2. Show Success UI
        setIsSuccess(true);
        
        // 3. Wait 1.5s then Redirect
        setTimeout(() => {
            // FORCE RELOAD: Ensures Navbar updates instantly
            window.location.href = '/'; 
        }, 1500);

      } else {
        alert("Login Failed: " + (data.detail || "Invalid credentials"));
        setIsLoading(false); // Only stop loading on error
      }
    } catch (error) {
      console.error(error);
      alert("Network Error. Is the backend running?");
      setIsLoading(false);
    }
  };

  // SUCCESS VIEW: Shows just before redirecting
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white text-black font-mono flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="w-full max-w-md border-2 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-green-400">
            <CheckCircle size={64} className="mx-auto mb-4 text-black" strokeWidth={3} />
            <h1 className="text-4xl font-black uppercase mb-2">Access Granted</h1>
            <p className="font-bold uppercase tracking-widest">Redirecting to Feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-mono flex flex-col items-center justify-center p-6">
      {/* Header Section */}
      <div className="w-full max-w-md mb-8 text-left">
        <div className="border border-black inline-block px-2 py-1 text-xs mb-4 uppercase tracking-widest font-bold">
          Vol. 1 - Access Portal
        </div>
        <h1 className="text-6xl font-black leading-none uppercase mb-2 tracking-tighter" style={{ fontFamily: 'serif' }}>
          WELCOME<br />BACK.
        </h1>
        <div className="border-l-2 border-black pl-4 py-1 mt-4">
          <p className="text-sm uppercase tracking-tight">
            Sign in to manage your <br /> 
            neighborhood tasks.
          </p>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
        
        {/* Username */}
        <div className="relative">
          <label className="block text-[10px] uppercase font-bold mb-1 tracking-widest">Username</label>
          <input 
            required
            name="username"
            onChange={handleChange}
            type="text" 
            placeholder="@username"
            className="w-full border-2 border-black p-4 focus:outline-none focus:bg-gray-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-300"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-[10px] uppercase font-bold mb-1 tracking-widest">Password</label>
          <input 
            required
            name="password"
            onChange={handleChange}
            type="password" 
            placeholder="••••••••"
            className="w-full border-2 border-black p-4 focus:outline-none focus:bg-gray-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-300"
          />
        </div>

        {/* Action Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="mt-2 bg-black text-white p-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <span>→</span>}
          {isLoading ? "AUTHENTICATING..." : "SIGN IN"}
        </button>

        {/* Links */}
        <div className="flex flex-col gap-2 items-center mt-4">
          <button 
            type="button"
            onClick={() => router.push('/register')}
            className="text-[10px] uppercase font-bold underline hover:no-underline"
          >
            Don't have an account? Create one
          </button>
          
          <p className="text-[10px] uppercase text-gray-500 mt-4">
            EST. 2026 // INDORE // SYSTEM_LOGIN
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;