import { io } from "socket.io-client";

export async function establishSocketConnection(token: string) {
  const socket = io(process.env.API?.split("/api")[0], {
    path: "/socket.io",
    auth: { token: token },
    transports: ["websocket"],
  })
  return socket
}

