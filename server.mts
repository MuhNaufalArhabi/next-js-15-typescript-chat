import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);
    io.on("connection", (socket) => {
        console.log("a user connected");

        socket.on("join-room", ({room, username}) => {
            socket.join(room);
            console.log(`${username} joined room: ${room}`);
            socket.to(room).emit("user-joined", `${username} has joined the room`);
        })

        socket.on("message", ({message, room, sender}) => {
            console.log(`Message from ${sender} in room ${room}: ${message}`);
            socket.to(room).emit("message", { sender, message });
        })
        // Disconnect event
        socket.on("disconnect", () => {
        console.log("user disconnected");
        });
    });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
