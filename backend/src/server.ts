import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


import newsRoutes from './routes/news';
import mensLadder from './routes/mensLadder';
import mensGames from './routes/mensGames';
import authRoutes from './routes/auth';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/mens/ladder', mensLadder);
app.use('/api/mens/games', mensGames);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});