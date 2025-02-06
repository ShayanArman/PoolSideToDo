const userRoutes = require('./routes/users');
const listRoutes = require('./routes/lists');
const todoRoutes = require('./routes/todos');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const API_KEY = process.env.API_KEY;

app.use(express.json()); 

// Generate a new secret key via: 'openssl rand -base64 32'
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5173' 
    : 'https://poolsidelist.ai/',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
  const apiKey = req.headers.authorization;
  if (!apiKey || apiKey !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/lists', listRoutes);
app.use('/api/v1/todos', todoRoutes.router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});