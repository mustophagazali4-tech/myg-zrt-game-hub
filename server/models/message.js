export class Message {
  constructor(senderId, senderUsername, content, roomId, type = 'text') {
    this.id = Date.now();
    this.senderId = senderId;
    this.senderUsername = senderUsername;
    this.content = content;
    this.roomId = roomId;
    this.type = type; // text, system, game-event
    this.timestamp = new Date();
  }

  static createSystemMessage(content, roomId) {
    const msg = new Message(null, 'System', content, roomId, 'system');
    return msg;
  }

  static createGameEvent(content, roomId) {
    const msg = new Message(null, 'Game', content, roomId, 'game-event');
    return msg;
  }
}
