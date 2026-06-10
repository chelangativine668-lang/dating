import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import PartnerProfile from "./pages/PartnerProfile";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import AdminChatDashboard from "./pages/AdminChatDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME - Partner list */}
        <Route path="/" element={<Home />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* PARTNER PROFILE */}
        <Route path="/partner/:id" element={<PartnerProfile />} />

        {/* CHAT (USER ↔ ADMIN) */}
        <Route path="/chat/:requestId" element={<Chat />} />

        {/* 🧑‍💼 ADMIN CHAT DASHBOARD */}
        <Route path="/admin/chat" element={<AdminChatDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;