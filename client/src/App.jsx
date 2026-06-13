import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import AdminDashboard from "./pages/AdminDashboard";
import AdminChatDashboard from "./pages/AdminChatDashboard";
import PartnerProfile from "./pages/PartnerProfile";
import RequestTracking from "./pages/RequestTracking";
import UserChatDashboard from "./pages/UserChatDashboard";

import Navbar from "./components/Navbar";

function App() {
return ( <BrowserRouter> <Navbar />


  <Routes>
    {/* AUTH */}
    <Route
      path="/login"
      element={<Login />}
    />

    <Route
      path="/register"
      element={<Register />}
    />

    {/* CHAT */}
    <Route
      path="/chat/:requestId"
      element={<Chat />}
    />

    {/* USER CHAT DASHBOARD */}
    <Route
      path="/my-chats"
      element={<UserChatDashboard />}
    />

    {/* REQUEST TRACKING */}
    <Route
      path="/tracking"
      element={<RequestTracking />}
    />

    {/* PARTNER PROFILE */}
    <Route
      path="/partner/:id"
      element={<PartnerProfile />}
    />

    {/* ADMIN DASHBOARD */}
    <Route
      path="/admin/:adminId"
      element={<AdminDashboard />}
    />

    <Route
      path="/admin"
      element={<AdminDashboard />}
    />

    {/* ADMIN CHATS */}
    <Route
      path="/admin/chat"
      element={<AdminChatDashboard />}
    />

    {/* HOME */}
    <Route
      path="/"
      element={<Home />}
    />

    {/* ADMIN URL ENTRY */}
    <Route
      path="/:adminId"
      element={<Home />}
    />
  </Routes>
</BrowserRouter>


);
}

export default App;
