import express, { Application } from 'express';
import jobsRouter from './routes/jobs';
import path from 'path';

const app: Application = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); 
app.use('/api/jobs', jobsRouter);

export default app;