import { Server, Socket } from 'socket.io'
import { Server as HttpServer } from 'http'
import { v4 } from 'uuid'

export class ServerSocket {
  public static instance: ServerSocket
  public io: Server
  public users: { [uid: string]: string }

  constructor(httpServer: HttpServer) {
    ServerSocket.instance = this
    this.users = {}
    this.io = new Server(httpServer, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: { origin: '*' },
    })
    this.io.on('connect', this.startListeners)
    console.info('socket IO started')
  }

  getUidFromSocketId = (id: string) => Object.keys(this.users).find(uid => this.users[uid] === id)

  sendMessage = (name: string, users: string[], payload?: Object) => {
    console.info('Emitting event: ' + name + ' to', users)
    users.forEach(id => payload ? this.io.to(id).emit(name, payload) : this.io.to(id))
  }

  startListeners = (socket: Socket) => {
    console.log('message received from ' + socket.id)

    socket.on('handshake', (callback: (uid: string, users: string[]) => void) => {
      console.info('Handshake, received from ' + socket.id)
      const isReconnected = Object.values(this.users).includes(socket.id)
      if (isReconnected) {
        console.log('this user has reconnected')
        const uid = this.getUidFromSocketId(socket.id)
        const users = Object.values(this.users) as string[]
        if (uid) {
          console.log(`sending callback for reconnect`)
          callback(uid, users)
          return
        }
      }
      const uid = v4()
      this.users[uid] = socket.id
      const users = Object.values(this.users)
      console.log('sending callback for handshake...')
      callback(uid, users)
      /**
       * send new user to all connected users
       */
      this.sendMessage('user_connected', users.filter(id => id !== socket.id))
    })


    socket.on('disconnect', () => {
      console.info('Disconnected from: ' + socket.id)
      const uid = this.getUidFromSocketId(socket.id)
      if(uid){
        delete this.users[uid]
        const users = Object.values(this.users)
        this.sendMessage('user_disconnected', users, uid)
      }
    })
  }


}