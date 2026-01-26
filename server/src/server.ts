import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import jobRoutes from './routes/jobs';
import path from 'path';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('joinJob', (jobId: string) => {
    socket.join(jobId);
    console.log(`Client joined room: ${jobId}`);
  });
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/jobs', jobRoutes);

// Database
mongoose.connect('mongodb://127.0.0.1:27017/csv_jobs')
  .then(() => console.log('MongoDB connected ✅'))
  .catch(err => console.error(err));

server.listen(3000, () => console.log('Server running on port 3000'));
export { io };
