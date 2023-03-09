import React, { FC, PropsWithChildren, useEffect, useReducer, useState } from 'react'
import { defaultSocketContextState, SocketIoContextProvider, SocketIoReducer } from './SocketIoContext'
import { useSocket } from '../../hooks/useSocket'

//todo
interface ISocketIoContextComponentProps extends PropsWithChildren {
}

const SocketIoContextComponent: FC<ISocketIoContextComponentProps> = ({ children }) => {
  const [SocketIoState, SocketIoDispatch] = useReducer(SocketIoReducer, defaultSocketContextState)
  const [loading, setLoading] = useState(true)
  const socket = useSocket({
    uri: 'ws://localhost:3333', opts: {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      autoConnect: false,
    },
  })
  useEffect(() => {
    // connect to the web socket
    socket.connect()
    //start the socket in context
    SocketIoDispatch({ type: 'update_socket', payload: socket })
    startListeners()
    // send the handshake
    sendShakeHands()
    //eslint-disable-netx-line
  }, [])

  const startListeners = () => {
    // user connected event
    socket.on('user_connected', (users: string[]) => {
      console.info(`user connected, new user list received`)
      SocketIoDispatch({ type: 'update_users', payload: users })
    })

    // user connected event
    socket.on('user_disconnected', (uid: string) => {
      console.info(`user disconnected...`)
      SocketIoDispatch({ type: 'remove_user', payload: uid })
    })


    socket.io.on('reconnect',
      attempt => console.log(`Reconnected on attempt:` + attempt))
    socket.io.on('reconnect_attempt',
      attempt => console.log(`Reconnected attempt:` + attempt))
    socket.io.on('reconnect_error',
      error => console.error(`Reconnected attempt:` + error))
    socket.io.on('reconnect_failed', () => {
      console.error(`Reconnected failed:`)
      alert('cannot connect web socket!')
    })
  }

  const sendShakeHands = () => {
    console.log('sending handshake to server....')
    socket.emit('handshake', (uid: string, users: string[]) => {
      SocketIoDispatch({ type: 'update_uid', payload: uid })
      SocketIoDispatch({ type: 'update_users', payload: users })
      setLoading(false)
    })
  }

  if (loading) {
    return <p>Loading Socket IO...</p>
  }
  return <SocketIoContextProvider value={{ SocketIoState, SocketIoDispatch }}>
    {children}
  </SocketIoContextProvider>
}


export default SocketIoContextComponent