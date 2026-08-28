import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import GameShowcase from './pages/GameShowcase'
import Multiplayer from './pages/Multiplayer'
import GameRoom from './pages/GameRoom'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  return (
    <Router>
      <div className="app">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<GameShowcase />} />
          <Route path="/multiplayer" element={<Multiplayer user={user} setUser={setUser} />} />
          <Route path="/game/:roomId" element={<GameRoom user={user} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
