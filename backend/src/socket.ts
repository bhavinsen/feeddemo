import { Socket, Server } from "socket.io";
import http from "http";

import { connect, shutdown } from "./coinbaseWs";

async function setupSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket: Socket) => {
    socket.on("subscribe", (message: any) => {
      connect(message, socket);
    });

    socket.on("unsubscribe", (product: any) => {
      shutdown(product, socket);
    });
  });

  io.on("disconnect", (socket: Socket) => {
    console.log("a user disconnected");
  });
}

export { setupSocket };
