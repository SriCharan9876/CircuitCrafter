// socket.js (new file in /src/services maybe)
import { io } from "socket.io-client";

let socket = null;

export const initSocket = (token, userId) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_BASE_URL, {
      withCredentials: true,
      auth: { userId, token },
    });
  }
  return socket;
};

export const getSocket = () => socket;
