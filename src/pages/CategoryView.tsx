import { useState } from "react";
import { ChevronLeft, BookOpen } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { categories, classes, getIconForCategory, lessons } from "../data/mockData";

export function CategoryView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Défaut au collège
  const [selectedClass, setSelectedClass] = useState("college");

  const category = categories.find((c) => c.id === id);
  // Filtrer par catégorie ET par classe sélectionnée
  const categoryLessons = lessons.filter(
    (l) => l.categoryId === id && l.classId === selectedClass
  );

  if (!category) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#001f4d] to-[#000a1f] text-white">
        <p>Catégorie non trouvée</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-600 rounded-lg">Retour</button>
      </div>
    );
  }

  const Icon = getIconForCategory(category.icon);

  return (
    <div className="min-h-full bg-gradient-to-b from-[#001f4d] to-[#000a1f] text-white flex flex-col pb-24">
      {/* Headers */}
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-[#001f4d]/80 backdrop-blur-md z-10 border-b border-white/10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className={`w-10 h-10 rounded-full ${category.bg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${category.color}`} />
        </div>
        <h2 className="text-xl font-bold flex-1">{category.name}</h2>
      </header>

      {/* Class Selector Pills */}
      <div className="px-4 py-3 bg-[#001f4d] border-b border-white/5 sticky top-[72px] z-10">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {classes.map((cls) => (
            <button
              key={cls.id}
              onClick={() => setSelectedClass(cls.id)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedClass === cls.id 
                ? "bg-blue-600 text-white" 
                : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      {/* Course List */}
      <div className="p-4 flex-1">
        <h3 className="text-gray-300 text-sm mb-4 uppercase tracking-wider font-semibold">Programme Officiel</h3>
        
        {categoryLessons.length > 0 ? (
          <div className="gap-4 flex flex-col">
            {categoryLessons.map((lesson) => (
              <div 
                key={lesson.id} 
                onClick={() => navigate(`/lesson/${lesson.id}`)}
                className="bg-[#0a1930] rounded-xl overflow-hidden shadow-lg border border-white/5 flex cursor-pointer hover:bg-[#112344] transition-colors"
              >
                <img src={lesson.image} alt={lesson.title} className="w-24 h-auto object-cover" />
                <div className="p-3 flex flex-col justify-center flex-1">
                  <h4 className="font-semibold text-mg mb-1 leading-tight">{lesson.title}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {lesson.level}</span>
                    <span>• {lesson.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 bg-white/5 rounded-2xl border border-white/10">
            <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-50" />
            <h4 className="text-lg font-medium text-gray-300 mb-2">Programme en cours de rédaction</h4>
            <p className="text-sm text-gray-500">Les cours pour cette classe seront bientôt disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
}
