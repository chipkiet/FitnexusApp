// app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRouter from './routes/auth.routes.js';

import session from 'express-session';
import passport from './config/passport.js';
import googleAuthRoutes from './routes/auth.js';

dotenv.config();
const app = express();
const isDev = process.env.NODE_ENV !== 'production';

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:5173';

// --- CORS (đặt TRƯỚC helmet)
const corsOptions = {
  origin: [
    FRONTEND,
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5178',
    'http://localhost:5179',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cache-Control', // cần cho một số browser
    'Pragma',        // tránh lỗi "pragma is not allowed"
    'Expires',
    'X-Requested-With',
  ],
  exposedHeaders: ['Set-Cookie'],
};

app.use(cors(corsOptions));

// Bảo hiểm header CORS + preflight cho mọi request
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.origin.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', FRONTEND);
  }
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Cache-Control, Pragma, Expires, X-Requested-With'
  );
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// --- Security middlewares
app.use(helmet());

// --- Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(isDev ? 'dev' : 'combined'));
}

// --- Cookies
app.use(cookieParser());

// --- Body parsers (200kb)
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true, limit: '200kb' }));

// --- Rate limit cho tất cả /api/auth/*
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 10, // 10 req / IP / phút
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    errors: [],
  },
});

// --- Routes API (JWT)
app.use('/api/auth', authRouter);

// --- session + passport (cho Google OAuth)
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,   // true nếu chạy HTTPS
      httpOnly: false, // bạn đang cần FE JS đọc; nếu không cần thì nên để true
      sameSite: 'lax', // nếu deploy khác domain và cần cross-site cookie: 'none' + secure:true
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// --- routes Google OAuth (dùng session)
app.use('/auth', googleAuthRoutes);

// --- Health
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// --- Root
app.get('/', (_req, res) => {
  res.json({ message: 'Chào mừng các tình yêu đã đến với web của anh' });
});

// --- 404
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errors: [],
  });
});

// --- Global error handler
app.use((err, _req, res, _next) => {
  if (isDev) {
    console.error('Global error:', err);
  }
  const status = err.status || 500;
  const safeMessage =
    status === 500 && !isDev ? 'Lỗi đăng ký ở app 1' : err.message;

  res.status(status).json({
    success: false,
    message: safeMessage || 'Lỗi đăng ký ở app 2',
    errors: Array.isArray(err.errors) ? err.errors : [],
    ...(isDev ? { stack: err.stack } : {}),
  });
});

export default app;
