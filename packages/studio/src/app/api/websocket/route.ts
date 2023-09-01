import { Server } from 'socket.io';
import { NextResponse } from 'next/server';

export async function GET({ req, res }) {
  const io = new Server({ path: '/api/websocket' });
  io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
  res.socket.server.io = io;
  return NextResponse.next({});
}
