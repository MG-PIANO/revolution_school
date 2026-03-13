import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, MoreHorizontal, Mic, Send, Bot, AlertCircle, Trash2, Camera, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleGenAI } from "@google/genai";
import { classes } from "../data/mockData";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  image?: string; // Base64 data
}

export function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = location.state as { initialMessage?: string; lessonId?: string } | null;

  // Polyfill pour le SpeechRecognition
  const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('rs_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Erreur de lecture de l'historique", e);
      }
    }
    return [
      { id: "1", text: "Bonjour ! Je suis ton assistant IA. Pose-moi une question sur tes cours.", sender: "bot" }
    ];
  });
  
  const [input, setInput] = useState(initialState?.initialMessage || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Instance de reconnaissance vocale conservée dans un Ref pour éviter les recréations
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Synchronisation avec le localStorage
  useEffect(() => {
    localStorage.setItem('rs_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem("rs_user_profile");
    if (saved) {
      setUserProfile(JSON.parse(saved));
    }
  }, []);

  // Initialisation du SpeechRecognition
  useEffect(() => {
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true; // Pour afficher le texte pendant la prononciation
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setInput((prev) => prev + event.results[i][0].transcript + " ");
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        // Pour faire un affichage fluide, on pourrait stocker l'intérim, 
        // mais pour faire simple, on ajoute la phrase finale dans l'input à la fin de la diction.
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage("Accès au microphone refusé.");
          setErrorVisible(true);
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListen = () => {
    if (!SpeechRecognitionAPI) {
      setErrorMessage("La reconnaissance vocale n'est pas supportée par votre navigateur.");
      setErrorVisible(true);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setErrorVisible(false);
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        // En cas d'erreur de lancement (ex: déjà démarré)
        console.error(err);
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    const messageText = input.trim();
    if (!messageText && !selectedImage) return;
    if (isLoading) return;

      const userMsg: Message = { 
        id: Date.now().toString(), 
        text: messageText, 
        sender: "user",
        image: selectedImage || undefined
      };
      setMessages(prev => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

    try {
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        setErrorMessage("Clé API Gemini introuvable. Veuillez configurer GEMINI_API_KEY.");
        setErrorVisible(true);
        setIsLoading(false);
        return;
      }

      setErrorVisible(false);
      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      const userClassName = userProfile?.classId ? classes.find(c => c.id === userProfile.classId)?.name : "Inconnue";
      
      const systemPrompt = `Tu es l'assistant pédagogique universel de 'Revolution School'. 
      L'élève s'appelle ${userProfile?.name || "Élève"} et est en classe de ${userClassName || "niveau scolaire indéfini"}.
      ADAPTE ton niveau de langage et tes explications à sa classe. 
      Ton objectif absolu est d'aider les élèves à assimiler N'IMPORTE QUEL CONCEPT.
      Tu as un accès intégral à toutes tes connaissances. Ne refuse jamais une question académique ! 
      Si on t'envoie une IMAGE, analyse-la attentivement : résous les exercices de maths, explique les schémas de bio, ou traduis les textes en photo.
      Sois extrêmement clair, patient, encourageant. Formate tes réponses avec du texte AÉRÉ : utilise le gras, les listes à puces et des blocs de code markdown.`;

      // Conversion de l'historique local pour Gemini
      const history = messages.map(m => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));

      const userParts: any[] = [{ text: messageText }];
      if (selectedImage) {
        const base64Data = selectedImage.split(',')[1];
        userParts.push({
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history,
          { role: "user", parts: userParts }
        ],
        config: {
          systemInstruction: systemPrompt,
        }
      });

      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: response.text || "Désolé, je n'ai pas pu générer de réponse.", 
        sender: "bot" 
      };
      setMessages(prev => [...prev, botMsg]);
      removeImage();
    } catch (error: any) {
      console.error("Error generating response:", error);
      let errorText = `Une erreur s'est produite : ${error.message || "Connexion à l'IA impossible."}`;
      
      if (error.message?.includes("429") || error.message?.includes("quota")) {
        errorText = "Oups ! Trop de questions d'un coup. Le quota gratuit est épuisé. Patiente 30 secondes et réessaye !";
      }

      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: errorText, 
        sender: "bot" 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Voulez-vous vraiment effacer tout l'historique de cette conversation ?")) {
      const welcomeMsg: Message = { 
        id: Date.now().toString(), 
        text: "Historique effacé. Comment puis-je t'aider à nouveau ?", 
        sender: "bot" 
      };
      setMessages([welcomeMsg]);
      localStorage.removeItem('rs_chat_history');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#001f4d] to-[#000a1f] text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-[#001f4d]/80 backdrop-blur-md border-b border-white/10 z-10 sticky top-0">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-semibold text-sm leading-none">Assistant RS</h2>
            <span className="text-[10px] text-blue-300">En ligne</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearHistory}
            className="p-2 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
            title="Effacer l'historique"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
          >
            {msg.sender === "bot" && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mb-1">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            
            <div 
              className={`max-w-[85%] rounded-2xl p-4 ${
                msg.sender === "user" 
                  ? "bg-[#1e3a8a] text-white rounded-br-none shadow-lg" 
                  : "bg-white text-gray-800 rounded-bl-none shadow-md"
              }`}
            >
              {msg.sender === "user" && msg.image && (
                <img src={msg.image} alt="User upload" className="w-full h-auto rounded-lg mb-2 shadow-sm border border-white/10" />
              )}
              {msg.sender === "user" && (
                <div className="flex justify-end mb-2">
                  {userProfile?.avatar ? (
                    <img src={userProfile.avatar} alt="User" className="w-6 h-6 rounded-full border border-blue-400 object-cover" />
                  ) : (
                    <img src="https://i.pravatar.cc/150?img=47" alt="User" className="w-6 h-6 rounded-full border border-blue-400" />
                  )}
                </div>
              )}
              <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                {msg.text}
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mb-1">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-none p-4 shadow-md flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
        {errorVisible && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 mt-4 text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400 mb-1">Erreur de connexion</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gradient-to-t from-[#000a1f] to-transparent absolute bottom-16 sm:bottom-[60px] w-full safe-area-bottom">
        {imagePreview && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2 relative inline-block ml-4"
          >
            <img src={imagePreview} alt="Aperçu" className="w-20 h-20 object-cover rounded-xl border-2 border-white shadow-lg" />
            <button 
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        <div className="bg-white rounded-full p-1 pl-2 pr-1 flex items-center gap-2 shadow-xl border border-white/10">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageSelect}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Pose ta question ou envoie une photo..."
            className="flex-1 bg-transparent text-gray-800 focus:outline-none text-sm py-3"
          />
          {input.trim() || selectedImage ? (
            <button 
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 hover:bg-blue-700 transition-all shadow-md active:scale-90"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
