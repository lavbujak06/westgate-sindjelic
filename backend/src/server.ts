import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { rateLimit } from 'express-rate-limit'; // Modern import style

// 1. Define the Limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 attempts
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { message: "Too many login attempts, please try again after 15 minutes" } 
});


import newsRoutes from './routes/news';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import auditRoutes from './routes/audit-logs';
import coachesRouter from './routes/coaches';
import contactRouter from './routes/contact';
import scraperRoutes from './routes/scraper';
import leagueRoutes from './routes/league';
import mediaRoutes from './routes/media';
import sponsorsRoutes from './routes/sponsors';
import highlightRouter from './routes/highlights';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/coaches', coachesRouter);
app.use('/api/contact', contactRouter)
app.use('/api/scraper', scraperRoutes);
app.use('/api/league', leagueRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/sponsors', sponsorsRoutes);
app.use('/api/highlights', highlightRouter);


app.listen(process.env.PORT, () => {
  console.log(`Backend running on http://localhost:${process.env.PORT}`);
});