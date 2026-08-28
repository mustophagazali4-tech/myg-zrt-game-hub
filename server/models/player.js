export class Player {
  constructor(id, username, socketId) {
    this.id = id;
    this.username = username;
    this.socketId = socketId;
    this.score = 0;
    this.status = 'idle'; // idle, in-game, waiting
    this.currentRoom = null;
    this.joinedAt = new Date();
    this.stats = {
      gamesPlayed: 0,
      gamesWon: 0,
      totalScore: 0,
      averageScore: 0
    };
  }

  joinRoom(roomId) {
    this.currentRoom = roomId;
    this.status = 'waiting';
  }

  leaveRoom() {
    this.currentRoom = null;
    this.status = 'idle';
  }

  startGame() {
    this.status = 'in-game';
  }

  endGame() {
    this.status = 'idle';
  }

  updateScore(points) {
    this.score += points;
    this.stats.totalScore += points;
  }

  recordWin() {
    this.stats.gamesWon += 1;
    this.stats.gamesPlayed += 1;
  }

  recordLoss() {
    this.stats.gamesPlayed += 1;
  }

  getAverageScore() {
    if (this.stats.gamesPlayed === 0) return 0;
    return Math.round(this.stats.totalScore / this.stats.gamesPlayed);
  }
}
