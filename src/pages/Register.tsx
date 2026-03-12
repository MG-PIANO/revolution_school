import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { User, BookOpen, ChevronRight, GraduationCap, Camera } from "lucide-react";
import { classes } from "../data/mockData";

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedClassId) return;

    const profile = {
      name,
      classId: selectedClassId,
      avatar: avatar,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("rs_user_profile", JSON.stringify(profile));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#001f4d] text-white flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#001f4d] to-[#000a1f]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-900/40">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Revolution School</h1>
          <p className="text-blue-300">Crée ton profil pour commencer à apprendre</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center mb-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full bg-white/10 border-2 border-dashed border-blue-400/50 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-blue-400 transition-all"
            >
              {avatar ? (
                <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-blue-300">
                  <Camera className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-bold">PHOTO</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleAvatarChange} 
              accept="image/*" 
              className="hidden" 
            />
            <p className="text-xs text-blue-300 mt-2">Clique pour ajouter ta photo</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-200 ml-1">Ton Nom Complet</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Jean Mukoko"
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-200 ml-1">Ta Classe / Niveau</label>
            <div className="relative">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                required
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer text-white text-sm"
              >
                <option value="" disabled className="bg-[#001f4d]">Sélectionne ta classe</option>
                <optgroup label="ENSEIGNEMENT GÉNÉRAL" className="bg-[#001f4d] font-bold text-blue-300">
                  {classes.filter(c => c.group === "Général").map((cls) => (
                    <option key={cls.id} value={cls.id} className="bg-[#001f4d] font-normal text-white">
                      {cls.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="TECHNIQUE INDUSTRIEL (E, F, H)" className="bg-[#001f4d] font-bold text-emerald-400">
                  {classes.filter(c => c.group === "Technique Industriel").map((cls) => (
                    <option key={cls.id} value={cls.id} className="bg-[#001f4d] font-normal text-white">
                      {cls.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="TECHNIQUE COMMERCIAL (G, BG)" className="bg-[#001f4d] font-bold text-amber-400">
                  {classes.filter(c => c.group === "Technique Commercial").map((cls) => (
                    <option key={cls.id} value={cls.id} className="bg-[#001f4d] font-normal text-white">
                      {cls.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 group"
          >
            C'est parti !
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-blue-400/60 leading-relaxed px-4">
          Tes données sont stockées localement sur ton appareil pour un accès rapide et sécurisé.
        </p>
      </motion.div>
    </div>
  );
}
