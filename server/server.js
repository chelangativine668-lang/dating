require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Supabase client
const supabase = require("./src/config/supabase");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const matchRoutes = require("./src/routes/matchRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const partnerRoutes = require("./src/routes/partnerRoutes");

const app = express();

/**
 * =========================
 * MIDDLEWARE
 * =========================
 */
app.use(cors({
  origin: "*", // safe for now (we can lock later)
  credentials: true
}));

app.use(express.json());

/**
 * =========================
 * BASE ROUTE
 * =========================
 */
app.get("/", (req, res) => {
  res.send("Matchmaking API is running 🚀");
});

/**
 * =========================
 * TEST ROUTES (UNCHANGED)
 * =========================
 */

app.get("/test-users", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) return res.status(400).json({ error: error.message });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/test-profiles", async (req, res) => {
  try {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) return res.status(400).json({ error: error.message });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/test-requests", async (req, res) => {
  try {
    const { data, error } = await supabase.from("match_requests").select("*");
    if (error) return res.status(400).json({ error: error.message });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/test-partners", async (req, res) => {
  try {
    const { data, error } = await supabase.from("public_partners").select("*");
    if (error) return res.status(400).json({ error: error.message });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * =========================
 * API ROUTES
 * =========================
 */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/partners", partnerRoutes);

/**
 * =========================
 * 404 HANDLER
 * =========================
 */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl
  });
});

/**
 * =========================
 * HTTP SERVER (REQUIRED FOR SOCKET.IO)
 * =========================
 */
const server = http.createServer(app);

/**
 * =========================
 * SOCKET.IO SETUP
 * =========================
 */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  /**
   * JOIN CHAT ROOM
   * room = match_request_id
   */
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  /**
   * REAL-TIME MESSAGE BROADCAST
   */
  socket.on("send_message", (data) => {
    // data = { requestId, message }
    io.to(data.requestId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

/**
 * =========================
 * START SERVER (RENDER SAFE)
 * =========================
 */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});