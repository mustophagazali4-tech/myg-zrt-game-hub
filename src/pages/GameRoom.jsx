import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function GameRoom({ user }) {
  const { roomId } = useParams()
  const [room, setRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [players, setPlayers] = useState([])

  useEffect(() => {
    // Mock room data
    const mockRoom = {
      id: roomId,
      name: 'Pixel Quest Adventure',
      game: 'Pixel Quest',
      maxPlayers: 4,
      status: 'Active'
    }
    setRoom(mockRoom)

    // Mock players
    const mockPlayers = [
      { id: 1, username: 'Player1', status: 'Playing' },
      { id: 2, username: user?.username || 'You', status: 'Playing' }
    ]
    setPlayers(mockPlayers)

    // Mock chat messages
    const mockMessages = [
      { id: 1, user: 'Player1', message: 'Hey, let\'s start!' },
      { id: 2, user: 'System', message: 'Game room created successfully' }
    ]
    setMessages(mockMessages)
  }, [roomId, user])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const msg = {
        id: messages.length + 1,
        user: user?.username || 'You',
        message: newMessage
      }
      setMessages([...messages, msg])
      setNewMessage('')
    }
  }

  if (!room) return <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>Loading...</div>

  return (
    <main>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ color: 'white', marginBottom: '10px' }}>{room.name}</h1>
          <p style={{ color: '#ccc' }}>Game: {room.game} | Status: {room.status}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
          {/* Game Area */}
          <div className="card" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
            <h3>Game Canvas</h3>
            <div style={{
              flex: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '48px'
            }}>
              🎮 Game Area
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Players List */}
            <div className="card">
              <h3>Players ({players.length}/{room.maxPlayers})</h3>
              <div style={{ marginTop: '15px' }}>
                {players.map(player => (
                  <div key={player.id} style={{
                    padding: '10px',
                    background: '#f0f0f0',
                    borderRadius: '5px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{player.username}</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>{player.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
              <h3>Chat</h3>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                marginBottom: '15px',
                padding: '10px',
                background: '#f9f9f9',
                borderRadius: '5px',
                fontSize: '14px'
              }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                    <strong>{msg.user}:</strong> {msg.message}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Send a message..."
                  style={{ flex: 1, padding: '10px', border: '1px solid #ddd' }}
                />
                <button type="submit" style={{ padding: '10px 20px' }}>Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default GameRoom
