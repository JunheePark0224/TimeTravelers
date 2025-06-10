// app.js
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('./config/passport');
require('dotenv').config();

const app = express();

// Import database
const { testConnection, createTables } = require('./config/db');

// MySQL session store
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // React frontend URL
  credentials: true
}));
app.use(express.json());

// Session configuration
app.use(session({
  key: 'session_cookie_name',
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Import and use API routes
const apiRoutes = require('./routes/index');
app.use('/api', apiRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'TimeTravelers Backend API is running!',
    timestamp: new Date().toISOString(),
    user: req.user ? req.user.email : 'Not logged in'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    await testConnection();
    await createTables();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Using Passport.js for authentication`);
      console.log(`Using MySQL for database`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();