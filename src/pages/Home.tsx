import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Search, ChevronRight, Crown, Mic, Calculator, Book, FlaskConical, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categories, lessons, getIconForCategory } from "../data/mockData";

export function Home() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Polyfill pour le SpeechRecognition
  const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  useEffect(() => {
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false; // On attend la phrase complète pour la redirection
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          // Redirection vers le chat avec le texte reconnu
          navigate("/chat", { state: { initialMessage: transcript } });
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [navigate, SpeechRecognitionAPI]);

  const toggleListen = (e: React.MouseEvent) => {
    e.stopPropagation(); // Évite de déclencher le onClick du conteneur (qui redirige vers /chat vide)
    
    if (!SpeechRecognitionAPI) {
      alert("La reconnaissance vocale n'est pas supportée par votre navigateur.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("rs_user_profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  // Filter lessons based on class if profile exists
  const userLessons = profile 
    ? lessons.filter(l => l.classId === profile.classId)
    : lessons;
    
  const popularLessons = userLessons.slice(0, 4);

  return (
    <div className="min-h-full bg-gradient-to-b from-[#001f4d] to-[#000a1f] text-white p-6 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 p-0.5">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-2 border-[#001f4d]"
              />
            ) : (
              <img
                src="https://i.pravatar.cc/150?img=47"
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-2 border-[#001f4d]"
              />
            )}
          </div>
          <div>
            <p className="text-sm text-blue-200">Bonjour,</p>
            <h2 className="text-xl font-bold">{profile?.name.split(' ')[0] || "Élève"}</h2>
          </div>
        </div>
        <button 
          onClick={() => navigate("/profile")}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="w-6 h-6 -rotate-90" />
        </button>
      </header>

      {/* Categories */}
      <div className="bg-white rounded-2xl p-4 mb-6 flex justify-between shadow-lg">
        {categories.map((cat) => {
          const Icon = getIconForCategory(cat.icon);
          return (
            <button 
              key={cat.id} 
              onClick={() => navigate(`/category/${cat.id}`)}
              className="flex flex-col items-center gap-2 hover:scale-105 transition-transform"
            >
              <div className={`w-14 h-14 rounded-full ${cat.bg} flex items-center justify-center`}>
                <Icon className={`w-7 h-7 ${cat.color}`} />
              </div>
              <span className="text-xs font-medium text-gray-800">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search/AI Input */}
      <div 
        onClick={() => navigate("/chat")}
        className="bg-white rounded-full p-1 pl-5 pr-2 flex items-center justify-between mb-8 shadow-lg cursor-text"
      >
        <span className="text-gray-400 text-sm">
          {isListening ? "Écoute en cours..." : "Pose ta question à l'IA..."}
        </span>
        <button 
          onClick={toggleListen}
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
            isListening 
              ? "bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      {/* Popular Lessons */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Leçons Populaires</h3>
          <ChevronRight className="w-5 h-5 text-blue-300" />
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {popularLessons.map((lesson) => (
            <div 
              key={lesson.id} 
              onClick={() => navigate(`/lesson/${lesson.id}`)}
              className="min-w-[160px] relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer"
            >
              <img src={lesson.image} alt={lesson.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                <h4 className="text-sm font-medium leading-tight">{lesson.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Banner */}
      <div className="bg-gradient-to-r from-[#0a2540] to-[#1a365d] rounded-2xl p-5 border border-blue-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="flex items-start gap-4 relative z-10 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-amber-400">Passe à PREMIUM</h3>
            <p className="text-sm text-blue-200">Accès illimité aux leçons !</p>
          </div>
        </div>
        <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 rounded-xl font-bold text-sm tracking-wide shadow-lg transition-all">
          S'ABONNER
        </button>
      </div>
    </div>
  );
}
