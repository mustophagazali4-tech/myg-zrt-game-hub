import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar({ user, setUser }) {
  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎮 Myg.zrt Game Hub
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/games" className="nav-link">Game Showcase</Link>
          </li>
          <li className="nav-item">
            <Link to="/multiplayer" className="nav-link">Multiplayer</Link>
          </li>
        </ul>

        <div className="nav-auth">
          {user ? (
            <>
              <span className="user-name">{user.username}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <button className="login-btn">Login</button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
