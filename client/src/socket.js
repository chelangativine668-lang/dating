import { io } from "socket.io-client";

const socket = io("https://matchmaking-platform-6ryo.onrender.com");

export default socket;