import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import AdminDashboard from "./pages/AdminDashboard";
import AdminChatDashboard from "./pages/AdminChatDashboard";
import PartnerProfile from "./pages/PartnerProfile";

import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      {/* NAVIGATION BAR */}
      <Navbar />

      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* ✅ NEW: ADMIN ROUTE FROM URL (YOUR MAIN GOAL) */}
        <Route path="/:adminId" element={<Home />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* REGISTER */}
        <Route path="/register" element={<Register />} />

        {/* CHAT */}
        <Route path="/chat/:requestId" element={<Chat />} />

        {/* ADMIN DASHBOARD (KEEP EXISTING - DO NOT BREAK OLD LINKS) */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* ADMIN CHAT */}
        <Route path="/admin/chat" element={<AdminChatDashboard />} />

        {/* PARTNER PROFILE */}
        <Route path="/partner/:id" element={<PartnerProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;