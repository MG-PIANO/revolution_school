import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trophy, ArrowRight, Star, Brain, Lightbulb, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { quizzes, classes } from "../data/mockData";

export function Challenges() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("rs_user_profile");
    if (saved) {
      setUserProfile(JSON.parse(saved));
    }
  }, []);

  const userClass = classes.find(c => c.id === userProfile?.classId);
  const filteredQuizzes = quizzes.filter(q => q.classId === userProfile?.classId);

  return (
    <div className="min-h-full bg-gradient-to-b from-[#001f4d] to-[#000a1f] text-white p-6 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="text-amber-400 w-7 h-7" />
            Challenges
          </h2>
          <p className="text-blue-300 text-sm">Prouve ta maîtrise, {userProfile?.name?.split(' ')[0]}</p>
        </div>
        <div className="bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/50 flex items-center gap-1">
          <Star className="w-4 h-4 text-amber-400 fill-current" />
          <span className="text-amber-400 font-bold text-sm">{(userProfile?.totalExp || 0).toLocaleString()}</span>
        </div>
      </header>

      {/* Featured Challenge */}
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 mb-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Brain className="w-24 h-24" />
        </div>
        <div className="relative z-10">
          <span className="bg-white/20 text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">CHALLENGE DE LA SEMAINE</span>
          <h3 className="text-xl font-bold mb-2">Grand Test : {userClass?.name || "Général"}</h3>
          <p className="text-blue-100 text-sm mb-4">Gagne jusqu'à 500 points et booste ton score de la semaine !</p>
          <button 
            className="bg-white text-blue-700 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2"
          >
            COMMENCER <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Categories of Tests */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Série de Tests ({userClass?.name?.split(':')[0] || "Ma Classe"})</h3>
        </div>

        {filteredQuizzes.length > 0 ? (
          <div className="grid gap-4">
            {filteredQuizzes.map((quiz) => (
              <div 
                key={quiz.id}
                onClick={() => navigate(`/quiz/${quiz.id}`)}
                className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between active:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <Lightbulb className="w-6 h-6 text-emerald-400 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{quiz.title}</h4>
                    <p className="text-xs text-blue-300">{quiz.subject} • {quiz.questions.length} Questions</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-8 text-center">
            <p className="text-blue-300 text-sm mb-2">Aucun test spécifique à ta classe pour le moment.</p>
            <p className="text-xs text-blue-400/60">L'IA prépare tes futurs exercices...</p>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="mt-10 grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
          <p className="text-xs text-blue-400 mb-1">Objectif Mensuel</p>
          <p className="text-lg font-bold">12/30 Tests</p>
          <div className="w-full h-1.5 bg-white/10 rounded-full mt-2">
            <div className="w-[40%] h-full bg-blue-500 rounded-full" />
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
          <p className="text-xs text-blue-400 mb-1">Position Classe</p>
          <p className="text-lg font-bold">3ème / 42</p>
          <div className="flex gap-1 mt-2">
            {[1,2,3,4,5].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 3 ? "bg-amber-400" : "bg-white/10"}`} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
