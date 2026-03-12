import { Home, MessageCircle, User, Trophy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { icon: Home, path: "/home", label: "Accueil" },
    { icon: Trophy, path: "/challenges", label: "Défis" },
    { icon: MessageCircle, path: "/chat", label: "Chat" },
    { icon: User, path: "/profile", label: "Profil" },
  ];

  return (
    <div className="bg-[#05152a] border-t border-white/10 px-6 py-3 flex justify-between items-center z-50 relative">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-200",
              isActive ? "text-blue-400" : "text-gray-400 hover:text-gray-300"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive && "fill-current")} strokeWidth={isActive ? 2 : 1.5} />
          </Link>
        );
      })}
    </div>
  );
}
