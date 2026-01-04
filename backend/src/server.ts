import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


import newsRoutes from './routes/news';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import auditRoutes from './routes/audit-logs';
import coachesRouter from './routes/coaches';
import contactRouter from './routes/contact';
import scraperRoutes from './routes/scraper';
import leagueRoutes from './routes/league';
import mediaRoutes from './routes/media';

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
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/coaches', coachesRouter);
app.use('/api/contact', contactRouter)
app.use('/api/scraper', scraperRoutes);
app.use('/api/league', leagueRoutes);
app.use('/api/media', mediaRoutes);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});