const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('./config/passport');
const { pool, testConnection, createTables } = require('./config/db');
const authRoutes = require('./routes/auth');
const timeDataRoutes = require('./routes/timeData');
const capsulesRoutes = require('./routes/capsules');
const newsRoutes = require('./routes/news');
const musicRoutes = require('./routes/music');
const moviesRoutes = require('./routes/movies'); 
const priceRoutes = require('./routes/price'); 
const celebRouter = require('./routes/celeb');

const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new MySQLStore({}, pool);

app.use(session({
  key: 'timecapsule_session',
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this-in-production',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: false,
    httpOnly: true,
    sameSite: 'lax'
  },
  rolling: true
}));

app.use(passport.initialize());
app.use(passport.session());

// 디버깅용 미들웨어 (개발 모드에서만 실행)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    if (req.isAuthenticated && typeof req.isAuthenticated === 'function') {
      console.log(`🔍 ${req.method} ${req.path} - Auth: ${req.isAuthenticated()}`);
    } else {
      console.log(`🔍 ${req.method} ${req.path} - Auth: N/A (Passport not ready)`);
    }
    next();
  });
}

// API 라우터 등록
app.use('/api/auth', authRoutes);
app.use('/api/time', timeDataRoutes);
app.use('/api/capsules', capsulesRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/movies', moviesRoutes); 
app.use('/api/price', priceRoutes);
app.use('/api/celeb', celebRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Time Capsule API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        birth_date: req.user.birth_date
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 핸들링
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

const startServer = async () => {
  try {
    await testConnection();
    await createTables();
    app.listen(PORT, () => {
      console.log(`✅ Time Capsule API Server is running on port ${PORT}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
