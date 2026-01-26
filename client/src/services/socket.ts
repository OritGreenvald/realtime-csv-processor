import { io as socketIOClient, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
export let socket: Socket;

export const initSocket = () => {
  socket = socketIOClient(SOCKET_URL);
};

export const joinJobRoom = (jobId: string) => {
  if (socket) {
    socket.emit('joinJob', jobId);
  }
};
