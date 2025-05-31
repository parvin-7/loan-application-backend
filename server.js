const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const loanRoutes = require('./routes/loan');
const authRoutes = require('./routes/auth');

const app = express();

// Middlewares
const cors = require('cors');
const cors = require('cors');
app.use(cors({
  origin: 'https://your-netlify-site.netlify.app', // replace this later after frontend deploy
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection Error:", err));

// Routes
app.use('/api/auth', authRoutes); 
app.use('/api/loan', loanRoutes);

mongoose.set('debug', true);

app.listen(5000, () => console.log('Server running on port 5000'));