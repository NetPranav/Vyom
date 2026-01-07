"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Use Environment Variable
const API_URL = process.env.NEXT_PUBLIC_API_URL ;

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '', 
    confirm_password: '', // Validation field
    phone_number: '',
    is_student: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Password Match Validation
    if (formData.password !== formData.confirm_password) {
      alert("⚠️ Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Prepare Payload (Remove confirm_password)
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number,
        is_student: formData.is_student
      };

      const response = await fetch(`${API_URL}/api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Account Created! Redirecting to login...");
        router.push('/login'); 
      } else {
        const errorData = await response.json();
        alert("Registration Failed: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error(error);
      alert("Network Error. Check console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-mono flex flex-col items-center justify-center p-6">
      {/* Header / Brand Section */}
      <div className="w-full max-w-md mb-8">
        <div className="border border-black inline-block px-2 py-1 text-xs mb-4 uppercase tracking-widest">
          Vol. 1 - Registration
        </div>
        <h1 className="text-6xl font-black leading-none uppercase mb-2 tracking-tighter" style={{ fontFamily: 'serif' }}>
          JOIN THE<br />FEED.
        </h1>
        <div className="border-l-2 border-black pl-4 py-1 mt-4">
          <p className="text-sm uppercase tracking-tight">
            Create your local profile to start <br /> 
            supplying or demanding.
          </p>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
        
        {/* Username */}
        <div className="relative">
          <label className="block text-[10px] uppercase font-bold mb-1 tracking-widest">Username</label>
          <input 
            required
            name="username"
            onChange={handleChange}
            type="text" 
            placeholder="@local_hero"
            className="w-full border-2 border-black p-4 focus:outline-none focus:bg-gray-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-300"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <label className="block text-[10px] uppercase font-bold mb-1 tracking-widest">Email Address</label>
          <input 
            required
            name="email"
            onChange={handleChange}
            type="email" 
            placeholder="name@example.com"
            className="w-full border-2 border-black p-4 focus:outline-none focus:bg-gray-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-300"
          />
        </div>

        {/* Password Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="relative">
              <label className="block text-[10px] uppercase font-bold mb-1 tracking-widest">Confirm Password</label>
              <input 
                required
                name="confirm_password"
                onChange={handleChange}
                type="password" 
                placeholder="••••••••"
                className={`w-full border-2 p-4 focus:outline-none focus:bg-gray-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-300 
                  ${formData.confirm_password && formData.password !== formData.confirm_password ? 'border-red-500' : 'border-black'}`}
              />
            </div>
        </div>

        {/* Phone */}
        <div className="relative">
          <label className="block text-[10px] uppercase font-bold mb-1 tracking-widest">Phone Number</label>
          <input 
            required
            name="phone_number"
            onChange={handleChange}
            type="tel" 
            placeholder="+91 98765 43210"
            className="w-full border-2 border-black p-4 focus:outline-none focus:bg-gray-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-300"
          />
        </div>

        {/* Student Checkbox */}
        <div className="flex items-center gap-3 border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <input 
            type="checkbox" 
            name="is_student"
            onChange={handleChange}
            className="w-5 h-5 accent-black border-2 border-black"
            id="student-check"
          />
          <label htmlFor="student-check" className="text-xs uppercase font-bold cursor-pointer select-none">
            I am a Student (Requires Verification)
          </label>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="mt-4 bg-black text-white p-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <span>+</span>}
          {isLoading ? "CREATING..." : "CREATE ACCOUNT"}
        </button>

        {/* 👇 LOGIN LINK ADDED HERE 👇 */}
        <div className="flex flex-col gap-2 items-center mt-4">
          <button 
            type="button"
            onClick={() => router.push('/login')}
            className="text-[10px] uppercase font-bold underline hover:no-underline"
          >
            Already have an account? Log In
          </button>
          
          <p className="text-[10px] uppercase text-gray-500 mt-2">
            EST. 2026 // INDORE // SECURE DATA ENTRY
          </p>
        </div>

      </form>
    </div>
  );
};

export default RegisterPage;