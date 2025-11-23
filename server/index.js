require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - Allow specific origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://buddy-script-23e18.web.app',
  'https://buddy-script-23e18.firebaseapp.com',
  '*'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Still allow the request but log it - don't block with error
      console.log('Origin not in whitelist:', origin);
      callback(null, true); // Changed from error to allow for debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/likes', require('./routes/likes'));

app.use('/api/stories', require('./routes/stories'));

// Placeholder routes for UI components not yet in DB
const { suggestions, events } = require('./data/dummyData');
app.get('/api/suggestions', (req, res) => res.json(suggestions));
app.get('/api/events', (req, res) => res.json(events));

// Basic route
app.get('/', (req, res) => {
  res.send('BuddyScript API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
