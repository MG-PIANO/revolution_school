import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Check, X, Trophy, ArrowRight, Brain } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { quizzes } from "../data/mockData";

export function Quiz() {
  const navigate = useNavigate();
  const { id } = useParams();
  const quiz = quizzes.find(q => q.id === id);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  if (!quiz) return <div className="p-8 text-white">Quiz non trouvé</div>;

  const currentQ = quiz.questions[currentQuestion];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQ.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      const finalScore = score; // The score is already updated in handleOptionClick
      const scoreOutOf20 = Math.round((finalScore / quiz.questions.length) * 20);
      const earnedXp = finalScore * 100;
      
      const savedProfile = localStorage.getItem("rs_user_profile");
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        profile.weeklyScore = scoreOutOf20;
        profile.totalExp = (profile.totalExp || 0) + earnedXp;
        localStorage.setItem("rs_user_profile", JSON.stringify(profile));
      }
    }
  };

  return (
    <div className="min-h-full bg-[#001f4d] text-white flex flex-col">
      {/* Quiz Header */}
      <header className="flex items-center justify-between p-6 bg-[#001f4d]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-gray-400">
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase font-bold text-blue-300 tracking-[0.2em]">{quiz.subject}</p>
          <h2 className="font-bold text-sm">{quiz.title}</h2>
        </div>
        <div className="text-xs font-mono font-bold text-blue-400 w-10">
          {currentQuestion + 1}/{quiz.questions.length}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-white/10">
        <motion.div 
          className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center max-w-lg mx-auto w-full">
        {!showResult ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h3 className="text-2xl font-bold leading-tight mb-10 text-center">
                {currentQ.question}
              </h3>

              <div className="space-y-4">
                {currentQ.options.map((option, index) => {
                  let statusStyle = "bg-white/5 border-white/10 text-white";
                  if (isAnswered) {
                    if (index === currentQ.correctAnswer) {
                      statusStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400";
                    } else if (index === selectedOption) {
                      statusStyle = "bg-red-500/20 border-red-500/50 text-red-400";
                    } else {
                      statusStyle = "bg-white/5 border-white/5 opacity-50";
                    }
                  } else if (selectedOption === index) {
                    statusStyle = "bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]";
                  }

                  return (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleOptionClick(index)}
                      className={`w-full p-5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between ${statusStyle}`}
                    >
                      <span className="font-medium">{option}</span>
                      {isAnswered && index === currentQ.correctAnswer && <Check className="w-5 h-5 text-emerald-400" />}
                      {isAnswered && index === selectedOption && index !== currentQ.correctAnswer && <X className="w-5 h-5 text-red-400" />}
                    </motion.button>
                  );
                })}
              </div>

              {isAnswered && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleNext}
                  className="w-full mt-10 py-5 bg-white text-[#001f4d] font-black rounded-2xl shadow-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 group"
                >
                  {currentQuestion === quiz.questions.length - 1 ? "VOIR LE RÉSULTAT" : "QUESTION SUIVANTE"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8"
          >
            <div className="w-32 h-32 bg-amber-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(251,191,36,0.3)] relative">
              <Trophy className="w-16 h-16 text-white" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full border-4 border-amber-400/30" 
              />
            </div>

            <div>
              <h2 className="text-3xl font-black mb-2">FÉLICITATIONS !</h2>
              <p className="text-blue-300">Tu as terminé le défi "{quiz.title}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-[320px] mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">Ma note</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-black text-white">
                    {Math.round((score / quiz.questions.length) * 20)}
                  </span>
                  <span className="text-sm text-blue-400">/20</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-amber-400 text-[10px] uppercase font-bold mb-1">Points XP</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-black text-amber-400">
                    +{score * 100}
                  </span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate("/challenges")}
              className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-900/40 active:scale-95 transition-all"
            >
              RETOURNER AUX DÉFIS
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
