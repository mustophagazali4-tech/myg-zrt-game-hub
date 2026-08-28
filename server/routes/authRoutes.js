import express from 'express';

const router = express.Router();

// Simple authentication (can be extended with JWT and database)

// Register
router.post('/register', (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email required' });
  }

  // TODO: Implement database storage and password hashing
  const user = {
    id: Date.now().toString(),
    username,
    email,
    createdAt: new Date()
  };

  res.status(201).json({
    message: 'User registered successfully',
    user
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email required' });
  }

  // TODO: Implement database lookup and JWT token generation
  const user = {
    id: Date.now().toString(),
    username,
    email
  };

  res.json({
    message: 'Login successful',
    user,
    token: 'mock-jwt-token'
  });
});

// Get current user (protected route)
router.get('/me', (req, res) => {
  // TODO: Implement JWT verification
  res.json({
    message: 'User profile',
    user: {
      id: '123',
      username: 'player1',
      email: 'player1@example.com'
    }
  });
});

export default router;
