// src/socket.js
import { io } from 'socket.io-client';

const URL = 'https://backendofquickmoney.onrender.com';

export const socket = io(URL, {
  autoConnect: false, // Prevents automatic connection on initialization
});

export default socket;
