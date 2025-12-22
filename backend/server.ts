import express from 'express';
import cors from 'cors';

import mensLadder from './routes/mensLadder';
import mensGames from './routes/mensGames';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/mens/ladder', mensLadder);
app.use('/api/mens/games', mensGames);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
