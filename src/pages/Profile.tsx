import React, { useState, useEffect } from "react";
import { ChevronRight, RefreshCw, X, LogOut, User as UserIcon, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { progressData, classes } from "../data/mockData";

export function Profile() {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("rs_user_profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const logout = () => {
    if (window.confirm("Es-tu sûr de vouloir te déconnecter ? Ton score actuel sera conservé.")) {
      localStorage.removeItem("rs_user_profile");
      navigate("/");
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatar = reader.result as string;
        const newProfile = { ...profile, avatar: newAvatar };
        setProfile(newProfile);
        localStorage.setItem("rs_user_profile", JSON.stringify(newProfile));
        showToast("Photo de profil mise à jour !");
      };
      reader.readAsDataURL(file);
    }
  };

  const userClassName = classes.find(c => c.id === profile?.classId)?.name || "Non définie";

  return (
    <div className="min-h-full bg-gradient-to-b from-[#001f4d] to-[#000a1f] text-white p-6 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-blue-300" />
          </div>
          <h2 className="text-xl font-bold">Mon Profil</h2>
        </div>
        <button 
          onClick={logout}
          className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          title="Déconnexion"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* User Info Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative group">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold overflow-hidden border-2 border-blue-400/30">
              {profile?.avatar ? (
                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                profile?.name.charAt(0)
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-400 transition-colors border-2 border-[#001f4d]">
              <Camera className="w-3 h-3 text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </label>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{profile?.name}</h3>
            <p className="text-blue-300">{userClassName}</p>
          </div>
        </div>
      </div>

      {/* Score Circle */}
      <div className="flex flex-col items-center justify-center mb-10">
        <h3 className="text-lg font-medium mb-6">Score de la Semaine</h3>
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Outer glow */}
          <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl" />
          
          {/* SVG Circle */}
          <svg className="w-full h-full transform -rotate-90 absolute inset-0" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (Math.min(profile?.weeklyScore || 0, 20) / 20 * 283)}
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-1000"
            />
          </svg>
          
          {/* Inner content */}
          <div className="relative w-36 h-36 bg-gradient-to-br from-[#0a2540] to-[#001f4d] rounded-full flex items-center justify-center border-4 border-[#001f4d] shadow-inner">
            <span className="text-5xl font-bold text-white tracking-tighter">
              {profile?.weeklyScore || "0"}<span className="text-2xl text-emerald-400">/20</span>
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="font-semibold text-lg">Progression</h3>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="space-y-4">
          {progressData.map((item) => (
            <div key={item.subject} className="flex items-center gap-4">
              <span className="text-sm text-gray-300 w-24 shrink-0">{item.subject}</span>
              <div className="h-4 flex-1 bg-[#1e293b] rounded-full overflow-hidden relative">
                <div 
                  className={`h-full ${item.color} rounded-full transition-all duration-1000`} 
                  style={{ width: `${(item.score / 20) * 100}%` }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/50">
                  {item.score}/20
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Cards */}
      <div className="space-y-3 mt-8">
        <div 
          onClick={() => showToast("Fonction de fixation d'objectifs bientôt disponible !")}
          className="bg-[#0a1930] rounded-2xl p-5 flex items-center justify-between border border-white/5 active:scale-95 transition-transform cursor-pointer"
        >
          <div>
            <h3 className="font-semibold text-lg mb-1">Objectif du Mois</h3>
            <p className="text-sm text-blue-300">Réviser 10 Chapitres</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        <div 
          onClick={() => showToast("Le programme de l'Université L1 est en cours de création.")}
          className="bg-[#0a1930] rounded-2xl p-5 flex items-center justify-between border border-white/5 active:scale-95 transition-transform cursor-pointer"
        >
          <div>
            <h3 className="font-semibold text-lg mb-1">Prochain Niveau</h3>
            <p className="text-sm text-blue-300">Université L1</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-in fade-in slide-in-from-bottom-5">
          <span className="text-sm font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
