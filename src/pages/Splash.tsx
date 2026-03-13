import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BookOpen } from "lucide-react";

export function Splash() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full min-h-[100dvh] flex flex-col items-center justify-between bg-gradient-to-b from-[#003366] via-[#001f4d] to-[#000a1f] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-400/30 blur-2xl rounded-full" />
            <div className="relative flex flex-col items-center">
              <div className="flex items-center justify-center bg-white text-[#001f4d] p-4 rounded-2xl shadow-2xl mb-2">
                <span className="text-6xl font-black tracking-tighter leading-none">RS</span>
              </div>
              <BookOpen className="w-16 h-16 text-white absolute -bottom-6 drop-shadow-lg" />
            </div>
          </div>

          <h1 className="text-4xl font-black text-white tracking-widest mt-8 text-center">
            REVOLUTION<br />
            <span className="font-light text-3xl tracking-[0.2em]">SCHOOL</span>
          </h1>
          
          <div className="w-16 h-0.5 bg-white/50 my-4" />
          
          <p className="text-blue-200 text-sm tracking-widest uppercase font-medium">
            Apprendre. Comprendre. Réussir.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="w-full px-8 pb-16 z-10"
      >
        <button
          onClick={() => {
            const profile = localStorage.getItem("rs_user_profile");
            if (profile) {
              navigate("/home");
            } else {
              navigate("/register");
            }
          }}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white rounded-full font-bold text-lg tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all active:scale-95"
        >
          DÉMARRER
        </button>
      </motion.div>
    </div>
  );
}
