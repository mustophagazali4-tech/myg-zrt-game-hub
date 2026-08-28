import express from 'express';

const router = express.Router();

// Get all active game rooms
router.get('/rooms', (req, res) => {
  const rooms = Array.from(global.gameRooms.values()).map(room => ({
    id: room.id,
    name: room.name,
    gameType: room.gameType,
    maxPlayers: room.maxPlayers,
    playerCount: room.players.length,
    players: room.players,
    status: room.status,
    isFull: room.isFull(),
    owner: room.owner,
    createdAt: room.createdAt
  }));

  res.json({
    total: rooms.length,
    rooms
  });
});

// Get specific room details
router.get('/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = global.gameRooms.get(roomId);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.json({
    id: room.id,
    name: room.name,
    gameType: room.gameType,
    maxPlayers: room.maxPlayers,
    playerCount: room.players.length,
    players: room.players,
    status: room.status,
    isFull: room.isFull(),
    owner: room.owner,
    gameState: room.gameState,
    createdAt: room.createdAt,
    startedAt: room.startedAt
  });
});

// Get all active players
router.get('/players', (req, res) => {
  const players = Array.from(global.players.values()).map(player => ({
    id: player.id,
    username: player.username,
    status: player.status,
    currentRoom: player.currentRoom,
    score: player.score,
    stats: player.stats,
    joinedAt: player.joinedAt
  }));

  res.json({
    total: players.length,
    players
  });
});

// Get player stats
router.get('/players/:playerId', (req, res) => {
  const { playerId } = req.params;
  const player = global.players.get(playerId);

  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }

  res.json({
    id: player.id,
    username: player.username,
    status: player.status,
    currentRoom: player.currentRoom,
    score: player.score,
    stats: player.stats,
    averageScore: player.getAverageScore(),
    joinedAt: player.joinedAt
  });
});

// Get game statistics
router.get('/stats', (req, res) => {
  const totalPlayers = global.players.size;
  const totalRooms = global.gameRooms.size;
  const activePlayers = Array.from(global.players.values()).filter(p => p.status !== 'idle').length;
  const playingRooms = Array.from(global.gameRooms.values()).filter(r => r.status === 'playing').length;

  res.json({
    totalPlayers,
    activePlayers,
    totalRooms,
    playingRooms,
    timestamp: new Date().toISOString()
  });
});

export default router;
