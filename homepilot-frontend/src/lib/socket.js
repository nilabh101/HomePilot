import { io } from "socket.io-client";
export const SOCKET_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000";
let socket = null;
export function getSocket() {
  if (!socket) socket = io(SOCKET_URL, { transports: ["websocket"] });
  return socket;
}
