import express from 'express';
import cors from 'cors';
import newsRoutes from './routes/news';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/news', newsRoutes);

app.listen(4000, () => console.log('Backend running'));
