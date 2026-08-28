import { Player } from '../models/player.js';
import { GameRoom } from '../models/gameRoom.js';
import { Message } from '../models/message.js';

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`\n✅ Player connected: ${socket.id}`);

    let currentPlayer = null;

    // ==================== ROOM EVENTS ====================

    socket.on('joinRoom', (data) => {
      const { roomId, username, playerId } = data;
      console.log(`📋 ${username} joining room ${roomId}`);

      // Create or get room
      let room = global.gameRooms.get(roomId);
      if (!room) {
        room = new GameRoom(roomId, `Room ${roomId}`, 'general', 4, { id: playerId, username });
        global.gameRooms.set(roomId, room);
      }

      // Create player
      currentPlayer = new Player(playerId, username, socket.id);
      currentPlayer.joinRoom(roomId);
      global.players.set(playerId, currentPlayer);

      // Add player to room
      if (room.players.length < room.maxPlayers) {
        room.players.push({ id: playerId, username });
      }

      // Join socket to room
      socket.join(roomId);

      // Notify room members
      io.to(roomId).emit('roomUpdate', {
        room: {
          id: room.id,
          name: room.name,
          gameType: room.gameType,
          maxPlayers: room.maxPlayers,
          players: room.players,
          status: room.status,
          isFull: room.isFull()
        }
      });

      io.to(roomId).emit('playerJoined', {
        playerId,
        username,
        playerCount: room.players.length,
        maxPlayers: room.maxPlayers
      });

      // Send system message
      const systemMsg = Message.createSystemMessage(
        `${username} joined the room`,
        roomId
      );
      io.to(roomId).emit('messageReceived', systemMsg);
    });

    socket.on('leaveRoom', (data) => {
      const { roomId, playerId, username } = data;
      console.log(`👋 ${username} leaving room ${roomId}`);

      if (currentPlayer) {
        currentPlayer.leaveRoom();
      }

      const room = global.gameRooms.get(roomId);
      if (room) {
        room.removePlayer(playerId);

        // Notify room members
        io.to(roomId).emit('playerLeft', {
          playerId,
          username,
          playerCount: room.players.length
        });

        // Send system message
        const systemMsg = Message.createSystemMessage(
          `${username} left the room`,
          roomId
        );
        io.to(roomId).emit('messageReceived', systemMsg);

        // Delete room if empty
        if (room.players.length === 0) {
          global.gameRooms.delete(roomId);
          console.log(`🗑️  Room ${roomId} deleted (empty)`);
        }
      }

      socket.leave(roomId);
    });

    // ==================== MESSAGING ====================

    socket.on('message', (data) => {
      const { roomId, message, username, playerId } = data;
      console.log(`💬 Message in ${roomId}: ${username} - ${message}`);

      const msg = new Message(playerId, username, message, roomId, 'text');
      io.to(roomId).emit('messageReceived', msg);
    });

    // ==================== GAME STATE ====================

    socket.on('gameStateUpdate', (data) => {
      const { roomId, gameState } = data;
      console.log(`🎮 Game state update in room ${roomId}`);

      const room = global.gameRooms.get(roomId);
      if (room) {
        room.updateGameState(gameState);
        io.to(roomId).emit('gameStateUpdated', {
          gameState: room.gameState
        });
      }
    });

    socket.on('playerMove', (data) => {
      const { roomId, playerId, move } = data;
      console.log(`🕹️  Player move in ${roomId}`);

      io.to(roomId).emit('playerMoved', {
        playerId,
        move
      });
    });

    socket.on('playerScore', (data) => {
      const { roomId, playerId, username, score } = data;
      console.log(`🏆 Score update: ${username} scored ${score}`);

      const player = global.players.get(playerId);
      if (player) {
        player.updateScore(score);
      }

      io.to(roomId).emit('scoreUpdated', {
        playerId,
        username,
        score,
        totalScore: player?.score || 0
      });
    });

    // ==================== GAME CONTROL ====================

    socket.on('startGame', (data) => {
      const { roomId } = data;
      console.log(`▶️  Starting game in room ${roomId}`);

      const room = global.gameRooms.get(roomId);
      if (room && room.players.length >= 2) {
        if (room.startGame()) {
          io.to(roomId).emit('gameStarted', {
            room: {
              id: room.id,
              status: 'playing',
              players: room.players,
              startedAt: room.startedAt
            }
          });

          const gameMsg = Message.createGameEvent(
            'Game has started!',
            roomId
          );
          io.to(roomId).emit('messageReceived', gameMsg);
        }
      }
    });

    socket.on('endGame', (data) => {
      const { roomId, winner } = data;
      console.log(`⏹️  Ending game in room ${roomId}`);

      const room = global.gameRooms.get(roomId);
      if (room) {
        room.endGame();
        io.to(roomId).emit('gameEnded', {
          room: {
            id: room.id,
            status: 'finished',
            winner,
            players: room.players
          }
        });

        const gameMsg = Message.createGameEvent(
          `Game ended! Winner: ${winner}`,
          roomId
        );
        io.to(roomId).emit('messageReceived', gameMsg);
      }
    });

    socket.on('resetGame', (data) => {
      const { roomId } = data;
      console.log(`🔄 Resetting game in room ${roomId}`);

      const room = global.gameRooms.get(roomId);
      if (room) {
        room.status = 'waiting';
        room.gameState = {};
        io.to(roomId).emit('gameReset', {
          room: {
            id: room.id,
            status: 'waiting',
            players: room.players
          }
        });
      }
    });

    // ==================== DISCONNECT ====================

    socket.on('disconnect', () => {
      console.log(`❌ Player disconnected: ${socket.id}`);

      if (currentPlayer) {
        const roomId = currentPlayer.currentRoom;
        if (roomId) {
          const room = global.gameRooms.get(roomId);
          if (room) {
            room.removePlayer(currentPlayer.id);
            io.to(roomId).emit('playerLeft', {
              playerId: currentPlayer.id,
              username: currentPlayer.username,
              playerCount: room.players.length
            });

            if (room.players.length === 0) {
              global.gameRooms.delete(roomId);
            }
          }
        }

        global.players.delete(currentPlayer.id);
      }
    });
  });
}
