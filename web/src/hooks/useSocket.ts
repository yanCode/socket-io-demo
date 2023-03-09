import socketIo from "socket.io-client";
import { useEffect, useRef } from "react";
import { SocketIoParameters } from "../typings";
import { Socket } from "socket.io-client/build/esm/socket";

export const useSocket = ({ uri, opts }: SocketIoParameters): Socket => {

  const { current: socket } = useRef(socketIo(uri, opts));
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);
  return socket;
};