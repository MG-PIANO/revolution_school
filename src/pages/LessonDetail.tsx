import { ChevronLeft, Play, Clock, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { lessons } from "../data/mockData";

export function LessonDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const lesson = lessons.find((l) => l.id === id);

  if (!lesson) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#001f4d] to-[#000a1f] text-white">
        <p>Leçon non trouvée</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 rounded-lg">Retour</button>
      </div>
    );
  }

  const handleAskAI = () => {
    navigate("/chat", { state: { initialMessage: `Peux-tu m'expliquer la leçon sur "${lesson.title}" ?`, lessonId: lesson.id } });
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-[#001f4d] to-[#000a1f] text-white flex flex-col pb-24">
      {/* Header Image & Back button */}
      <div className="relative h-64 w-full">
        <img src={lesson.image} alt={lesson.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001f4d] to-transparent via-[#001f4d]/60" />
        
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 left-4 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            <Play className="w-6 h-6 text-white ml-1" fill="white" />
        </button>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-blue-300 mb-2">
            <span className="bg-blue-900/50 px-2 py-1 rounded-md">{lesson.level}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {lesson.duration}</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight">{lesson.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 space-y-6">
        <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
           {lesson.content.split('\n').map((paragraph, idx) => (
             <p key={idx} className="mb-4">{paragraph}</p>
           ))}
        </div>

        {/* AI Action Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-2xl p-5 border border-indigo-500/30 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-400/30 transition-colors" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
               <Sparkles className="w-6 h-6 text-indigo-300" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-lg text-white mb-1">Besoin d'aide ?</h3>
              <p className="text-sm text-indigo-200">Notre assistant IA peut t'expliquer cette leçon en détail.</p>
            </div>
            <button 
              onClick={handleAskAI}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-bold text-sm tracking-wide shadow-lg transition-colors whitespace-nowrap"
            >
              Poser une question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
