import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;
  public users: { [uid: string]: string };

  constructor(httpServer: HttpServer) {
    ServerSocket.instance = this;
    this.users = {};
    this.io = new Server(httpServer, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: { origin: '*' }
    });
    this.io.on('connect', this.StartListeners);
    console.info('socket IO started');
  }

  StartListeners = (socket: Socket) => {
    console.log('message received from ' + socket.id);

    socket.on('handshake', () => {
      console.info('Handshake, received from ' + socket.id);
    });

    socket.on('disconnect',()=>{
      console.info('Disconnected from: '+socket.id)
    })
  };


}