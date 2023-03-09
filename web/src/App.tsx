import React, { FC, useContext } from 'react'

import './App.css'
import SocketIoContext from './contexts/SocketIo/SocketIoContext'

export interface IAppProps {
}

const App: FC<IAppProps> = () => {

  const { socket, uid, users } = useContext(SocketIoContext).SocketIoState
  return (
    <div className='App'>
      <h2>Socket Io Information:</h2>
      <p>
        Your user ID: <strong>{uid}</strong> <br />
        Users online: <strong>{users.length}</strong> <br />
        Socket ID: <strong>{socket?.id}</strong> <br />
      </p>
    </div>
  )
}

export default App
