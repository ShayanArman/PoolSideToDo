// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const API_KEY = process.env.API_KEY;

// Generate a new secret key via: 'openssl rand -base64 32'
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5173' 
    : 'app://.',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  const apiKey = req.headers.authorization;
  if (!apiKey || apiKey !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});