import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";

export function MobileLayout() {
  const location = useLocation();
  const isSplash = location.pathname === "/";

  return (
    <div className="min-h-screen bg-[#051124] flex items-center justify-center sm:p-4">
      <div className="w-full max-w-md h-[100dvh] sm:h-[850px] bg-[#020b18] sm:rounded-[3rem] sm:border-[8px] border-gray-800 overflow-hidden relative shadow-2xl flex flex-col">
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          <Outlet />
        </div>
        {!isSplash && (
          <div className="safe-area-bottom">
            <BottomNav />
          </div>
        )}
      </div>
    </div>
  );
}
