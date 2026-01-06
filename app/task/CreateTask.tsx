"use client";

import { useState, useEffect } from 'react';
import { 
  MapPin, X, Camera, ArrowRight, AlertCircle, Tag, Navigation, Loader2 
} from 'lucide-react';
import { gsap } from 'gsap';
import { uploadImage } from '@/app/actions/upload'; // Import your server action

// Define the shape of data for local state
interface TaskForm {
  title: string;
  description: string;
  category: string; 
  priority: "STANDARD" | "URGENT";
  budget: string;
  deadline: string;
  estimated_duration: string;
  contact_email: string;
  primary_phone: string;
  location_string: string;
  latitude: number | null;
  longitude: number | null;
}

const CreateTask = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  // 1. Loading State
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. Form State
  const [form, setForm] = useState<TaskForm>({
    title: "",
    description: "",
    category: "",
    priority: "STANDARD",
    budget: "",
    deadline: "", 
    estimated_duration: "1 Hour", // Default value
    contact_email: "",
    primary_phone: "",
    location_string: "",
    latitude: null,
    longitude: null,
  });

  // 3. Image State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // GSAP Animation
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(".popup-inner", 
        { scale: 0.95, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.4, ease: "power4.out" }
      );
    }
  }, [isOpen]);

  // Handle Text Inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Geolocation
  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            location_string: prev.location_string || "Pinned Location (GPS)" 
          }));
          alert("Location Pinned! 📍");
        },
        (error) => alert("Could not get location. Please enable GPS.")
      );
    }
  };

  // Handle Image Selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Show preview instantly
    }
  };

  // SUBMIT FORM
// ... inside CreateTask.tsx

  const handleSubmit = async () => {
    // 1. Validation
    if (!form.title || !form.budget || !form.primary_phone || !form.latitude) {
      alert("Please fill all required fields and pin your location.");
      return;
    }

    setIsLoading(true);

    try {
      let finalImageUrl = "";

      // 2. Upload Image
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        finalImageUrl = await uploadImage(formData); 
      }

      // 3. Prepare Payload
      const token = localStorage.getItem("accessToken"); 

      // FIX: Convert the local date string to a proper ISO UTC string
      const formattedDeadline = new Date(form.deadline).toISOString();

      const payload = {
        title: form.title,
        description: form.description,
        tags: form.category,
        priority: form.priority,
        budget: parseFloat(form.budget),
        deadline: formattedDeadline, // <--- SEND THE FORMATTED DATE
        estimated_duration: form.estimated_duration,
        contact_email: form.contact_email,
        primary_phone: form.primary_phone,
        location_string: form.location_string,
        latitude: form.latitude,
        longitude: form.longitude,
        image: finalImageUrl 
      };

      // 4. Send JSON
      const response = await fetch("http://127.0.0.1:8000/api/tasks/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Task Broadcasted Successfully! 🚀");
        onClose();
      } else {
        const errorData = await response.json();
        alert("Error: " + JSON.stringify(errorData));
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Check console.");
    } finally {
      setIsLoading(false);
    }
  };
  
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
                <label className="text-[10px] font-black uppercase mb-1 block tracking-widest">Task Title *</label>
                <input 
                    name="title"
                    onChange={handleChange}
                    type="text" 
                    placeholder="E.G. FIX LEAKING PIPE" 
                    className="w-full border-2 border-black p-4 text-xl font-bold uppercase placeholder:text-gray-300 outline-none focus:bg-gray-50"
                />
            </div>

            {/* Row 2: Category & Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-black uppercase mb-1 block tracking-widest flex items-center gap-1">
                        <Tag size={10} /> Category (Type freely)
                    </label>
                    <input 
                        name="category"
                        onChange={handleChange}
                        type="text"
                        placeholder="PLUMBING, CLEANING..."
                        className="w-full border-2 border-black p-3 font-bold uppercase outline-none"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase mb-1 block tracking-widest flex items-center gap-1">
                        <AlertCircle size={10} /> Priority
                    </label>
                    <div className="flex border-2 border-black">
                        {['STANDARD', 'URGENT'].map((p) => (
                            <button 
                                key={p}
                                onClick={() => setForm({...form, priority: p as "STANDARD" | "URGENT"})}
                                className={`flex-1 py-3 text-xs font-bold uppercase transition-colors ${form.priority === p ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Row 3: Budget & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-black uppercase mb-1 block tracking-widest">Budget (₹) *</label>
                    <input 
                        name="budget"
                        onChange={handleChange}
                        type="number" 
                        className="w-full border-2 border-black p-3 font-bold outline-none"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase mb-1 block tracking-widest">Deadline *</label>
                    <input 
                        name="deadline"
                        onChange={handleChange}
                        type="datetime-local" 
                        className="w-full border-2 border-black p-3 font-bold outline-none uppercase"
                    />
                </div>
            </div>

            {/* Row 4: Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-black uppercase mb-1 block tracking-widest">Phone *</label>
                    <input 
                        name="primary_phone"
                        onChange={handleChange}
                        type="tel" 
                        placeholder="+91..."
                        className="w-full border-2 border-black p-3 font-bold outline-none"
                    />
                </div>
                <div>
                    <label className="text-[10px] font-black uppercase mb-1 block tracking-widest">Email *</label>
                    <input 
                        name="contact_email"
                        onChange={handleChange}
                        type="email" 
                        className="w-full border-2 border-black p-3 font-bold outline-none"
                    />
                </div>
            </div>

            {/* Row 5: Location */}
            <div>
                <label className="text-[10px] font-black uppercase mb-1 block tracking-widest flex items-center gap-1">
                    <MapPin size={10} /> Location *
                </label>
                <div className="flex border-2 border-black focus-within:ring-2 ring-black/10">
                    <input 
                        name="location_string"
                        onChange={handleChange}
                        value={form.location_string}
                        type="text" 
                        placeholder="ENTER ADDRESS OR USE PIN..." 
                        className="flex-1 p-3 font-bold uppercase outline-none placeholder:text-gray-300"
                    />
                    <button 
                        onClick={handleGeolocation}
                        className="bg-gray-100 px-4 border-l-2 border-black hover:bg-black hover:text-white transition-colors flex items-center gap-2 text-xs font-black uppercase"
                    >
                        <Navigation size={14} /> 
                        <span className="hidden sm:inline">Pin GPS</span>
                    </button>
                </div>
                {form.latitude && form.longitude && <p className="text-[10px] text-green-600 font-bold mt-1">✓ Coordinates Captured: {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}</p>}
            </div>

            {/* Row 6: Description */}
            <div>
                <label className="text-[10px] font-black uppercase mb-1 block tracking-widest">Description</label>
                <textarea 
                    name="description"
                    onChange={handleChange}
                    placeholder="PROVIDE DETAILED INSTRUCTIONS..." 
                    className="w-full border-2 border-black p-3 h-24 outline-none focus:bg-gray-50 uppercase font-bold text-sm resize-none"
                />
            </div>

            {/* Row 7: Image Upload */}
            <div className="border-2 border-dashed border-black p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all relative group overflow-hidden">
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="h-32 object-cover border-2 border-black" />
                ) : (
                    <>
                        <Camera size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                        <span className="font-black uppercase text-xs tracking-widest underline">Click to Upload Photo</span>
                    </>
                )}
                <input type="file" onChange={handleImageSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            {/* Action Button */}
            <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-black text-white p-5 font-black text-2xl uppercase italic tracking-tighter shadow-[8px_8px_0px_rgba(0,0,0,0.2)] hover:translate-y-1 transition-all flex items-center justify-between group border-2 border-black disabled:opacity-50"
            >
                {isLoading ? (
                    <span className="flex items-center gap-2"><Loader2 className="animate-spin"/> Publishing...</span>
                ) : (
                    <>
                        <span>Broadcast Task.</span>
                        <ArrowRight size={28} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;