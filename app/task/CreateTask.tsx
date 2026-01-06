"use client"
import { useState,useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Plus, 
  X, 
  Camera, 
  ArrowRight, 
  AlertCircle, 
  Tag, 
  Navigation 
} from 'lucide-react';

const CreateTask = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [priority, setPriority] = useState("MEDIUM");
  
  useEffect(() => {
    if (isOpen) {
      // Pop-in animation
      gsap.fromTo(".popup-inner", 
        { scale: 0.95, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.4, ease: "power4.out" }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="popup-inner bg-white border-4 border-black w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] font-mono custom-scrollbar">
        
        {/* Header */}
        <div className="border-b-4 border-black p-6 flex justify-between items-center bg-white sticky top-0 z-10 text-black">
          <h2 className="text-4xl md:text-5xl font-serif font-[900] uppercase italic leading-[0.8] tracking-tighter">
            Create Task
          </h2>
          <button onClick={onClose} className="border-2 border-black p-1 hover:bg-black hover:text-white transition-all">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="p-6 space-y-6 text-black">
            
            {/* Row 1: Title */}
            <div>
                <label className="text-[10px] font-black uppercase mb-1 block tracking-widest">Task Title</label>
                <input 
                    type="text" 
                    placeholder="E.G. FIX LEAKING PIPE" 
                    className="w-full border-2 border-black p-4 text-xl font-bold uppercase placeholder:text-gray-300 outline-none focus:bg-gray-50"
                />
            </div>

            {/* Row 2: Category & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                    <label className="text-[10px] font-black uppercase mb-1 block tracking-widest flex items-center gap-1">
                        <Tag size={10} /> Category
                    </label>
                    <div className="relative">
                        <select className="w-full border-2 border-black p-3 font-bold uppercase appearance-none bg-transparent outline-none">
                            <option>Manual Labor</option>
                            <option>Tech Support</option>
                            <option>Delivery</option>
                            <option>Education</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">▼</div>
                    </div>
                </div>

                {/* Priority */}
                <div>
                    <label className="text-[10px] font-black uppercase mb-1 block tracking-widest flex items-center gap-1">
                        <AlertCircle size={10} /> Priority
                    </label>
                    <div className="flex border-2 border-black">
                        {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                            <button 
                                key={p}
                                onClick={() => setPriority(p)}
                                className={`flex-1 py-3 text-xs font-bold uppercase transition-colors ${priority === p ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 3: Location */}
            <div>
                <label className="text-[10px] font-black uppercase mb-1 block tracking-widest flex items-center gap-1">
                    <MapPin size={10} /> Location
                </label>
                <div className="flex border-2 border-black focus-within:ring-2 ring-black/10">
                    <input 
                        type="text" 
                        placeholder="ENTER ADDRESS MANUALLY..." 
                        className="flex-1 p-3 font-bold uppercase outline-none placeholder:text-gray-300"
                    />
                    <button className="bg-gray-100 px-4 border-l-2 border-black hover:bg-black hover:text-white transition-colors flex items-center gap-2 text-xs font-black uppercase">
                        <Navigation size={14} /> 
                        <span className="hidden sm:inline">Use My Location</span>
                    </button>
                </div>
            </div>

            {/* Row 4: Description */}
            <div>
                <label className="text-[10px] font-black uppercase mb-1 block tracking-widest">Description</label>
                <textarea 
                    placeholder="PROVIDE DETAILED INSTRUCTIONS..." 
                    className="w-full border-2 border-black p-3 h-24 outline-none focus:bg-gray-50 uppercase font-bold text-sm resize-none"
                />
            </div>

            {/* Row 5: Image Upload */}
            <div className="border-2 border-dashed border-black p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all relative group">
                <Camera size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-black uppercase text-xs tracking-widest underline">Click to Upload Photo</span>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            {/* Action Button */}
            <button className="w-full bg-black text-white p-5 font-black text-2xl uppercase italic tracking-tighter shadow-[8px_8px_0px_rgba(0,0,0,0.2)] hover:translate-y-1 transition-all flex items-center justify-between group border-2 border-black">
                <span>Broadcast Task.</span>
                <ArrowRight size={28} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask