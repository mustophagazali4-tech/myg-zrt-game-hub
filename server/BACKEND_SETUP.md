# Myg.zrt Game Hub - Backend Setup Guide

## Overview

This is the backend server for Myg.zrt Game Hub, built with Node.js, Express, and Socket.io for real-time multiplayer gaming.

## Features

✅ **Real-time Multiplayer** - WebSocket support via Socket.io
✅ **Game Room Management** - Create, join, and manage game rooms
✅ **Player Management** - Track players and their stats
✅ **In-game Messaging** - Real-time chat system
✅ **Game State Synchronization** - Keep all players in sync
✅ **Scoring System** - Track player scores and stats
✅ **RESTful API** - Manage rooms and players via HTTP

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Update .env file:**
   ```
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:3000
   JWT_SECRET=your_secret_key_here
   ```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## Project Structure

```
server/
├── index.js                    # Main server file
├── package.json                # Dependencies
├── .env.example                # Environment template
├── models/
│   ├── gameRoom.js             # GameRoom class
│   ├── player.js               # Player class
│   └── message.js              # Message class
├── routes/
│   ├── gameRoutes.js           # Game management endpoints
│   └── authRoutes.js           # Authentication endpoints
├── socket/
│   └── socketHandlers.js       # Socket.io event handlers
└── BACKEND_SETUP.md            # This file
```

## API Endpoints

### Health Check
```
GET /api/health
Response: { status, timestamp, rooms, players }
```

### Game Rooms

**Get all rooms:**
```
GET /api/games/rooms
Response: { total, rooms[] }
```

**Get specific room:**
```
GET /api/games/rooms/:roomId
Response: { id, name, gameType, players, status, ... }
```

### Players

**Get all players:**
```
GET /api/games/players
Response: { total, players[] }
```

**Get player stats:**
```
GET /api/games/players/:playerId
Response: { id, username, stats, score, ... }
```

### Statistics

**Get game stats:**
```
GET /api/games/stats
Response: { totalPlayers, activePlayers, totalRooms, playingRooms }
```

### Authentication

**Register user:**
```
POST /api/auth/register
Body: { username, email }
Response: { user }
```

**Login user:**
```
POST /api/auth/login
Body: { username, email }
Response: { user, token }
```

## Socket.io Events

### Room Events

**Join Room:**
```javascript
socket.emit('joinRoom', {
  roomId: 'room-1',
  username: 'PlayerName',
  playerId: 'player-123'
});

// Listen for room updates
socket.on('roomUpdate', (data) => {
  // data: { room: { id, name, players, status, ... } }
});

socket.on('playerJoined', (data) => {
  // data: { playerId, username, playerCount }
});
```

**Leave Room:**
```javascript
socket.emit('leaveRoom', {
  roomId: 'room-1',
  playerId: 'player-123',
  username: 'PlayerName'
});

socket.on('playerLeft', (data) => {
  // data: { playerId, username, playerCount }
});
```

### Messaging

**Send Message:**
```javascript
socket.emit('message', {
  roomId: 'room-1',
  message: 'Hello!',
  username: 'PlayerName',
  playerId: 'player-123'
});

socket.on('messageReceived', (msg) => {
  // msg: { id, senderId, senderUsername, content, timestamp, type }
});
```

### Game Control

**Start Game:**
```javascript
socket.emit('startGame', {
  roomId: 'room-1'
});

socket.on('gameStarted', (data) => {
  // data: { room: { id, status, players, startedAt } }
});
```

**Player Move:**
```javascript
socket.emit('playerMove', {
  roomId: 'room-1',
  playerId: 'player-123',
  move: { x: 100, y: 200 }
});

socket.on('playerMoved', (data) => {
  // data: { playerId, move }
});
```

**Update Score:**
```javascript
socket.emit('playerScore', {
  roomId: 'room-1',
  playerId: 'player-123',
  username: 'PlayerName',
  score: 100
});

socket.on('scoreUpdated', (data) => {
  // data: { playerId, username, score, totalScore }
});
```

**End Game:**
```javascript
socket.emit('endGame', {
  roomId: 'room-1',
  winner: 'PlayerName'
});

socket.on('gameEnded', (data) => {
  // data: { room: { id, status, winner, players } }
});
```

**Reset Game:**
```javascript
socket.emit('resetGame', {
  roomId: 'room-1'
});

socket.on('gameReset', (data) => {
  // data: { room: { id, status, players } }
});
```

### Game State

**Update Game State:**
```javascript
socket.emit('gameStateUpdate', {
  roomId: 'room-1',
  gameState: { level: 1, health: 100 }
});

socket.on('gameStateUpdated', (data) => {
  // data: { gameState }
});
```

## Data Models

### GameRoom
```javascript
{
  id: string,
  name: string,
  gameType: string,
  maxPlayers: number,
  owner: Player,
  players: Player[],
  status: 'waiting' | 'playing' | 'finished',
  gameState: object,
  createdAt: Date,
  startedAt: Date | null
}
```

### Player
```javascript
{
  id: string,
  username: string,
  socketId: string,
  score: number,
  status: 'idle' | 'in-game' | 'waiting',
  currentRoom: string | null,
  joinedAt: Date,
  stats: {
    gamesPlayed: number,
    gamesWon: number,
    totalScore: number,
    averageScore: number
  }
}
```

### Message
```javascript
{
  id: number,
  senderId: string,
  senderUsername: string,
  content: string,
  roomId: string,
  type: 'text' | 'system' | 'game-event',
  timestamp: Date
}
```

## Global State Management

The server maintains two global Maps:

```javascript
global.gameRooms    // Map<roomId, GameRoom>
global.players      // Map<playerId, Player>
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

## Security Notes

⚠️ **Current Implementation:**
- Authentication is placeholder (no database)
- No password hashing
- No JWT token validation

📋 **TODO for Production:**
1. Implement MongoDB/PostgreSQL database
2. Add JWT token generation and verification
3. Implement password hashing with bcryptjs
4. Add input validation and sanitization
5. Add rate limiting
6. Implement room access control
7. Add logging and monitoring
8. Add SSL/TLS encryption

## Development Tools

### Testing API Endpoints

Use Postman or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Get all rooms
curl http://localhost:5000/api/games/rooms

# Get all players
curl http://localhost:5000/api/games/players

# Get stats
curl http://localhost:5000/api/games/stats
```

### Testing Socket.io

Use socket.io client or the frontend app:

```javascript
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected');
  socket.emit('joinRoom', {
    roomId: 'test-room',
    username: 'TestPlayer',
    playerId: 'test-player'
  });
});
```

## Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env file
# Or kill process using port 5000
```

**CORS errors:**
- Check CLIENT_URL in .env
- Ensure frontend and backend are running

**Socket connection issues:**
- Check browser console for errors
- Verify Socket.io version compatibility

## Next Steps

1. Connect to MongoDB database
2. Implement JWT authentication
3. Add room password protection
4. Implement game-specific logic
5. Add player statistics persistence
6. Deploy to production server
7. Set up monitoring and logging

## Support

For issues or questions, please check the main repository: https://github.com/mustophagazali4-tech/myg-zrt-game-hub
