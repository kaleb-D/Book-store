import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
//import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
//import configurePassport from './config/passport.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

const app = express();

// --------------- Security Middleware ---------------

// Helmet for secure HTTP headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// --------------- Body Parsing ---------------

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --------------- Passport ---------------

/*app.use(passport.initialize());
configurePassport();*/

// --------------- Static Files ---------------

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------- API Routes ---------------

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// --------------- Health Check ---------------

app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: "All good",
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// --------------- Error Handling ---------------

app.use(notFound);
app.use(errorHandler);
`1`
// --------------- Start Server ---------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});

export default app;
