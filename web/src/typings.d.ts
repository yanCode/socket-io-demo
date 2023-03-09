import { ManagerOptions } from "socket.io-client/build/esm/manager";
import { SocketOptions } from "socket.io-client/build/esm/socket";
import { Socket } from "socket.io-client";
import { Dispatch } from "react";


export type SocketIoParameters = {
  uri: string,
  opts?: Partial<ManagerOptions & SocketOptions>
}

export interface ISocketContextState {
  socket?: Socket
  uid: string,
  users: string[]
}

export type SocketContextActions = "update_socket" | "update_uid" | "update_users" | "remove_user"
export type SocketContextPayload = string | string[] | Socket

export interface ISocketContextActions {
  type: SocketContextActions,
  payload: SocketContextPayload
}

export interface ISocketIoContextProps {
  SocketIoState: ISocketContextState;
  SocketIoDispatch: Dispatch<ISocketContextActions>
}