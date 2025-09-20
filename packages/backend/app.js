import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.routes.js';

// đầu tiên : nạp .env , đăng ký middleware 
dotenv.config();

const app = express();

//middleware
// morgan log request, cookie-parser
app.use(morgan('combined'));
app.use(cookieParser());

app.use(cors({
    origin: [  process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174', 'http://localhost:5175' ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// body parse middleware
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb'}));


//routes
app.use('/api/auth', authRouter);

app.get('/api/health', (req, res) => {
res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Chào mừng các tình yêu đã đến với web của anh'
    })
})

app.use('*', (req, res) => {
    res.status(404).json({
        success:false,
        message: 'Route not found'
    });
});

app.use((err, req, res, next) => {
    console.log('Global error: ', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' ? {stack: err.stack} :{} )
    });
});

export default app;
