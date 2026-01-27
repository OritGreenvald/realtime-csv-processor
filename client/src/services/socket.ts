import { io as socketIOClient, Socket } from 'socket.io-client';
import { JobProgress } from '../types';

const SOCKET_URL = 'http://localhost:3000';

export const socket: Socket = socketIOClient(SOCKET_URL);

export const joinJobRoom = (jobId: string) => {
  socket.emit('joinJobRoom', jobId);
};


