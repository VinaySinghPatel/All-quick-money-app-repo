require('dotenv').config();
const connectTomongo = require('./database');
const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const Chat = require('./models/chat');
const chatRoutes = require('./routes/Chat');

const app = express();
const port = process.env.PORT || 5000;


const allowedOrigins = [
  'http://localhost:3000',
  'https://67564946d8f04f4373e76ea3--deft-semifreddo-592c5a.netlify.app' 
 
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));


////////////////////////////////////////////////////////////////////////////////////
//Socket-Io Work
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS (Socket.IO)"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Creating connnection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join('_');
    socket.join(roomId);
    console.log(`User ${senderId} joined room ${roomId}`);
  });

  socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
    const roomId = [senderId, receiverId].sort().join('_');

    io.to(roomId).emit('receiveMessage', { senderId, message });

    const newMessage = new Chat({ senderId, receiverId, message, roomId });
    await newMessage.save();
  });

  socket.on('disconnect', () => {
    // console.log('User disconnected:', socket.id);
  });
});



// app.use(cors());

app.use(express.json());

connectTomongo().then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection failed:', error);
  process.exit(1);
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/post', require('./routes/post'));
app.use('/api/otp', require('./routes/otp'));
app.use('/api/Chat',chatRoutes);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
