import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

function Multiplayer({ user, setUser }) {
  const [rooms, setRooms] = useState([])
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [newRoom, setNewRoom] = useState({ name: '', game: '', maxPlayers: 4 })
  const [username, setUsername] = useState(user?.username || '')
  const navigate = useNavigate()

  useEffect(() => {
    // Mock rooms data
    const mockRooms = [
      { id: 1, name: 'Pixel Quest Adventure', game: 'Pixel Quest', players: 2, maxPlayers: 4, status: 'Active' },
      { id: 2, name: 'Speed Racing League', game: 'Speed Racer', players: 3, maxPlayers: 4, status: 'Active' },
      { id: 3, name: 'Card Clash Championship', game: 'Card Clash', players: 1, maxPlayers: 2, status: 'Waiting' },
    ]
    setRooms(mockRooms)
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (username.trim()) {
      const userData = { username, id: Date.now() }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      setUsername('')
    }
  }

  const handleCreateRoom = (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please login first')
      return
    }
    const room = {
      id: rooms.length + 1,
      name: newRoom.name,
      game: newRoom.game,
      players: 1,
      maxPlayers: newRoom.maxPlayers,
      status: 'Active',
      owner: user.username
    }
    setRooms([...rooms, room])
    setNewRoom({ name: '', game: '', maxPlayers: 4 })
    setShowCreateRoom(false)
  }

  const joinRoom = (roomId) => {
    if (!user) {
      alert('Please login first')
      return
    }
    navigate(`/game/${roomId}`)
  }

  return (
    <main>
      <div className="hero">
        <h1>Multiplayer Gaming</h1>
        <p>Join game rooms or create your own and play with friends!</p>
      </div>

      <div className="container">
        {!user ? (
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="card">
              <h2 style={{ marginBottom: '20px' }}>Login to Play</h2>
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{ width: '100%', marginBottom: '15px' }}
                />
                <button type="submit" style={{ width: '100%' }}>
                  Login
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <p style={{ color: 'white', fontSize: '18px', marginBottom: '20px' }}>
                Welcome, <strong>{user.username}</strong>!
              </p>
              <button onClick={() => setShowCreateRoom(!showCreateRoom)}>
                {showCreateRoom ? 'Cancel' : '+ Create New Room'}
              </button>
            </div>

            {showCreateRoom && (
              <div style={{ maxWidth: '500px', margin: '0 auto 40px' }}>
                <div className="card">
                  <h3>Create Game Room</h3>
                  <form onSubmit={handleCreateRoom}>
                    <input
                      type="text"
                      placeholder="Room name"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                      required
                      style={{ width: '100%', marginBottom: '15px' }}
                    />
                    <select
                      value={newRoom.game}
                      onChange={(e) => setNewRoom({ ...newRoom, game: e.target.value })}
                      required
                      style={{ width: '100%', marginBottom: '15px' }}
                    >
                      <option value="">Select a game</option>
                      <option value="Pixel Quest">Pixel Quest</option>
                      <option value="Speed Racer">Speed Racer</option>
                      <option value="Card Clash">Card Clash</option>
                      <option value="Block Breaker">Block Breaker</option>
                    </select>
                    <input
                      type="number"
                      min="2"
                      max="8"
                      value={newRoom.maxPlayers}
                      onChange={(e) => setNewRoom({ ...newRoom, maxPlayers: parseInt(e.target.value) })}
                      style={{ width: '100%', marginBottom: '15px' }}
                    />
                    <button type="submit" style={{ width: '100%' }}>
                      Create Room
                    </button>
                  </form>
                </div>
              </div>
            )}

            <div className="rooms-container">
              <h2 style={{ color: 'white', marginBottom: '30px' }}>Available Rooms</h2>
              {rooms.length === 0 ? (
                <p style={{ color: 'white', textAlign: 'center' }}>No rooms available. Create one to get started!</p>
              ) : (
                rooms.map(room => (
                  <div key={room.id} className="room-card">
                    <div className="room-info">
                      <h3>{room.name}</h3>
                      <p>Game: <strong>{room.game}</strong> | Owner: <strong>{room.owner || 'System'}</strong></p>
                      <p>Status: <strong>{room.status}</strong></p>
                    </div>
                    <div className="players-badge">
                      👥 {room.players}/{room.maxPlayers}
                    </div>
                    <button onClick={() => joinRoom(room.id)}>
                      Join Room
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default Multiplayer
