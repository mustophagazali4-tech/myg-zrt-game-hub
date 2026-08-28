export class GameRoom {
  constructor(id, name, gameType, maxPlayers, owner) {
    this.id = id;
    this.name = name;
    this.gameType = gameType;
    this.maxPlayers = maxPlayers;
    this.owner = owner;
    this.players = [owner];
    this.status = 'waiting'; // waiting, playing, finished
    this.gameState = {};
    this.createdAt = new Date();
    this.startedAt = null;
  }

  addPlayer(player) {
    if (this.players.length < this.maxPlayers) {
      this.players.push(player);
      return true;
    }
    return false;
  }

  removePlayer(playerId) {
    this.players = this.players.filter(p => p.id !== playerId);
  }

  getPlayerCount() {
    return this.players.length;
  }

  isFull() {
    return this.players.length >= this.maxPlayers;
  }

  startGame() {
    if (this.players.length >= 2) {
      this.status = 'playing';
      this.startedAt = new Date();
      return true;
    }
    return false;
  }

  endGame() {
    this.status = 'finished';
  }

  updateGameState(state) {
    this.gameState = { ...this.gameState, ...state };
  }
}
