/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MobileLayout } from "./components/layout/MobileLayout";
import { Splash } from "./pages/Splash";
import { Home } from "./pages/Home";
import { Chat } from "./pages/Chat";
import { Profile } from "./pages/Profile";
import { Register } from "./pages/Register";
import { CategoryView } from "./pages/CategoryView";
import { LessonDetail } from "./pages/LessonDetail";
import { Challenges } from "./pages/Challenges";
import { Quiz } from "./pages/Quiz";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MobileLayout />}>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/category/:id" element={<CategoryView />} />
          <Route path="/lesson/:id" element={<LessonDetail />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/quiz/:id" element={<Quiz />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
