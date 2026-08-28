import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

function Home() {
  return (
    <main>
      <div className="hero">
        <h1>Welcome to Myg.zrt Game Hub</h1>
        <p>Discover amazing games, showcase your creations, and play multiplayer games with friends!</p>
        
        <div style={{ display: 'flex', gap: '20px', justify: 'center', marginTop: '40px', flexWrap: 'wrap' }}>
          <Link to="/games">
            <button>Explore Game Showcase</button>
          </Link>
          <Link to="/multiplayer">
            <button>Join Multiplayer</button>
          </Link>
        </div>
      </div>

      <div className="container">
        <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '40px', fontSize: '32px' }}>
          Features
        </h2>
        
        <div className="games-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div className="card">
            <h3>🎮 Game Showcase</h3>
            <p>Browse and discover a collection of amazing games created by our community.</p>
          </div>
          
          <div className="card">
            <h3>👥 Multiplayer Gaming</h3>
            <p>Create or join game rooms and play real-time multiplayer games with other players.</p>
          </div>
          
          <div className="card">
            <h3>🚀 Real-time Updates</h3>
            <p>Experience seamless real-time multiplayer with WebSocket support.</p>
          </div>
          
          <div className="card">
            <h3>🏆 Game Rooms</h3>
            <p>Create private or public game rooms and invite friends to play together.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home
