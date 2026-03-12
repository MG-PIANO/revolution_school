import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export function MobileLayout() {
  const location = useLocation();
  const isSplash = location.pathname === "/";

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md h-[100dvh] sm:h-[850px] bg-[#020b18] sm:rounded-[2.5rem] sm:border-[8px] border-gray-800 overflow-hidden relative shadow-2xl flex flex-col">
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          <Outlet />
        </div>
        {!isSplash && <BottomNav />}
      </div>
    </div>
  );
}
