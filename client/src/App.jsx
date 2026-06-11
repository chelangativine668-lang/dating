import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import AdminDashboard from "./pages/AdminDashboard";
import AdminChatDashboard from "./pages/AdminChatDashboard";
import PartnerProfile from "./pages/PartnerProfile";

import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      {/* NAVIGATION BAR (visible on all pages) */}
      <Navbar />

      {/* APP ROUTES */}
      <Routes>
        {/* HOME / PARTNERS PAGE */}
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* CHAT */}
        <Route path="/chat/:requestId" element={<Chat />} />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/chat" element={<AdminChatDashboard />} />

        {/* PARTNER PROFILE */}
        <Route path="/partner/:id" element={<PartnerProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;