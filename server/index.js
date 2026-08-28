import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import gameRoutes from './routes/gameRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { setupSocketHandlers } from './socket/socketHandlers.js';
import { GameRoom } from './models/gameRoom.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Store active rooms
global.gameRooms = new Map();
global.players = new Map();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running!',
    timestamp: new Date().toISOString(),
    rooms: global.gameRooms.size,
    players: global.players.size
  });
});

// Setup Socket.io handlers
setupSocketHandlers(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`🎮 Game Hub Server running on http://localhost:${PORT}`);
  console.log(`\n📡 Socket.io listening for real-time connections`);
  console.log(`\n📋 Available Routes:`);
  console.log(`  GET /api/health - Server health check`);
  console.log(`  POST /api/auth/register - Register new user`);
  console.log(`  POST /api/auth/login - Login user`);
  console.log(`  GET /api/games/rooms - Get all game rooms`);
  console.log(`  POST /api/games/rooms - Create new room`);
  console.log(`  GET /api/games/rooms/:roomId - Get room details`);
  console.log(`\n🔌 Socket Events:`);
  console.log(`  - joinRoom`);
  console.log(`  - leaveRoom`);
  console.log(`  - message`);
  console.log(`  - gameStateUpdate`);
  console.log(`  - playerMove`);
});
