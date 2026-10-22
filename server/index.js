import express from 'express';
import cors from 'cors';
import { initDatabase } from './db.js';
import { seedScenarios } from './seedScenarios.js';
import { router } from './routes.js';

const app = express();
const PORT = process.env.PORT || 3344;

app.use(cors());
app.use(express.json());

// Initialize SQLite database schema and seed data
initDatabase();
seedScenarios();

// Mount API routes
app.use('/api', router);

export const server = app.listen(PORT, () => {
  console.log(`[CyberDesk Server] REST API running at http://localhost:${PORT}/api`);
});

export default app;
