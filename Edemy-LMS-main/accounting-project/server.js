import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectMongoDB from './configs/mongodb.js';
import connectPostgres from './configs/postgres.js';
import accountingRouter from './routes/accounting.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect databases
await connectMongoDB();
await connectPostgres();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Accounting Project API is running!', databases: ['MongoDB', 'PostgreSQL'] });
});
app.use('/api/accounting', accountingRouter);

// Status endpoint to check DBs
app.get('/api/status', async (req, res) => {
  res.json({ 
    mongo: 'connected',
    postgres: 'connected',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Accounting server running on port ${PORT}`);
});

export default app;

