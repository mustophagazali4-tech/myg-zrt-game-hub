import React, { useState, useEffect } from 'react'
import '../App.css'

function GameShowcase() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with API call
    const mockGames = [
      {
        id: 1,
        title: 'Pixel Quest',
        description: 'An epic pixel art adventure game',
        emoji: '🗡️',
        genre: 'Adventure'
      },
      {
        id: 2,
        title: 'Block Breaker',
        description: 'Classic block breaking puzzle game',
        emoji: '🧱',
        genre: 'Puzzle'
      },
      {
        id: 3,
        title: 'Speed Racer',
        description: 'Fast-paced racing game with multiplayer support',
        emoji: '🏎️',
        genre: 'Racing'
      },
      {
        id: 4,
        title: 'Card Clash',
        description: 'Strategic card game for multiplayer battles',
        emoji: '🃏',
        genre: 'Strategy'
      },
      {
        id: 5,
        title: 'Treasure Hunt',
        description: 'Exploration game with hidden treasures',
        emoji: '💎',
        genre: 'Adventure'
      },
      {
        id: 6,
        title: 'Space Shooter',
        description: 'Defend your planet in this arcade shooter',
        emoji: '🚀',
        genre: 'Shooter'
      },
    ]
    setGames(mockGames)
    setLoading(false)
  }, [])

  return (
    <main>
      <div className="hero">
        <h1>Game Showcase</h1>
        <p>Explore our collection of amazing games</p>
      </div>

      <div className="container">
        {loading ? (
          <p style={{ color: 'white', textAlign: 'center' }}>Loading games...</p>
        ) : (
          <div className="games-grid">
            {games.map(game => (
              <div key={game.id} className="game-card">
                <div className="game-thumbnail" style={{ fontSize: '80px' }}>
                  {game.emoji}
                </div>
                <div className="game-info">
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>
                  <p style={{ fontSize: '12px', color: '#667eea', fontWeight: 'bold' }}>
                    {game.genre}
                  </p>
                  <div className="game-actions">
                    <button>Play</button>
                    <button>Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default GameShowcase
