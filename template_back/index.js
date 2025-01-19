const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

// Mock user database
const users = [];

// Authentication routes
app.post('/api/users/register', (req, res) => {
  const { username, email, password, name } = req.body;
  
  if (!username || !email || !password || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const userExists = users.find(u => u.username === username || u.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    email,
    password, // In a real app, hash this password
    name
  };

  users.push(newUser);
  res.status(201).json({ token: 'mock_token_' + newUser.id });
});

app.post('/api/users/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({ token: 'mock_token_' + user.id });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
