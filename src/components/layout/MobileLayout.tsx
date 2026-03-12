import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export function MobileLayout() {
  const location = useLocation();
  const isSplash = location.pathname === "/";

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-2xl min-h-screen sm:min-h-[850px] bg-[#020b18] sm:my-4 sm:rounded-[2.5rem] sm:border-[8px] border-gray-800 overflow-hidden relative shadow-2xl flex flex-col">
        <div className="flex-1 overflow-y-auto no-scrollbar relative mb-20 scroll-smooth">
          <Outlet />
        </div>
        {!isSplash && <BottomNav />}
      </div>
    </div>
  );
}
