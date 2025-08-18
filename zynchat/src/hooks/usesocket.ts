import { Server } from "socket.io";
import http from "http";


const server = http.createServer(/* app */);

const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});


const users: Record<string, string> = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;
  if (userId) {
    users[userId] = socket.id;
    console.log(`Usuario conectado: ${userId}`);
  }

  socket.on("send_message", (msg) => {
  
    const receiverSocketId = users[msg.receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", msg);
    }
   
  });

  socket.on("disconnect", () => {
    if (userId) {
      delete users[userId];
      console.log(`Usuario desconectado: ${userId}`);
    }
  });
});


server.listen(3001, () => {
  console.log("Socket.IO server running on port 3001");
});