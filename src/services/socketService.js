import io from 'socket.io-client'

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000'

class SocketService {
  constructor() {
    this.socket = null
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      })

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket.id)
      })

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected')
      })
    }
    return this.socket
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data)
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback)
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // Room methods
  joinRoom(roomId, username) {
    this.emit('joinRoom', { roomId, username })
  }

  leaveRoom(roomId) {
    this.emit('leaveRoom', { roomId })
  }

  sendMessage(roomId, message) {
    this.emit('message', { roomId, message })
  }

  // Game state methods
  updateGameState(roomId, gameState) {
    this.emit('gameStateUpdate', { roomId, gameState })
  }

  onRoomUpdate(callback) {
    this.on('roomUpdate', callback)
  }

  onPlayerJoined(callback) {
    this.on('playerJoined', callback)
  }

  onPlayerLeft(callback) {
    this.on('playerLeft', callback)
  }

  onMessageReceived(callback) {
    this.on('messageReceived', callback)
  }

  onGameStateUpdate(callback) {
    this.on('gameStateUpdate', callback)
  }
}

export default new SocketService()
