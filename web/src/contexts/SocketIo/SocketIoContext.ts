import { ISocketContextActions, ISocketContextState, ISocketIoContextProps } from "../../typings";
import { Socket } from "socket.io-client";
import { createContext } from "react";


export const defaultSocketContextState: ISocketContextState = {
  socket: undefined,
  uid: "",
  users: []
};
export const SocketIoReducer = (state: ISocketContextState, action: ISocketContextActions) => {
  console.log(`message received -action: ${action.type} - Payload: `, action.payload);
  switch (action.type) {
    case "update_socket":
      return { ...state, socket: action.payload as Socket };
    case "update_uid":
      return { ...state, uid: action.payload as string };
    case "update_users": {
      return { ...state, users: action.payload as string[] };
    }
    case "remove_user": {
      return { ...state, users: state.users.filter(uid => uid !== action.payload as string) };
    }
    default:
      return { ...state };
  }
};

const SocketIoContext = createContext<ISocketIoContextProps>({
  SocketIoDispatch: () => {
  },
  SocketIoState: defaultSocketContextState
});

export const SocketIoContextConsumer = SocketIoContext.Consumer;
export const SocketIoContextProvider = SocketIoContext.Provider;

export default SocketIoContext;