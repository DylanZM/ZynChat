import { Server } from "socket.io";
import http from "http";

// Si usas Express, importa tu app de Express aquí
// import app from "./app";

// Crea el servidor HTTP (si usas Express, pásale app)
const server = http.createServer(/* app */);

const io = new Server(server, {
  cors: {
    origin: "*", // Cambia esto por la URL de tu frontend en producción
    methods: ["GET", "POST"]
  }
});

// Mapeo de usuarios conectados: userId -> socketId
const users: Record<string, string> = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;
  if (userId) {
    users[userId] = socket.id;
    console.log(`Usuario conectado: ${userId}`);
  }

  // Escuchar mensajes enviados
  socket.on("send_message", (msg) => {
    // msg debe tener: senderId, receiverId, text, time
    const receiverSocketId = users[msg.receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", msg);
    }
    // Aquí puedes guardar el mensaje en la base de datos si quieres
  });

  socket.on("disconnect", () => {
    if (userId) {
      delete users[userId];
      console.log(`Usuario desconectado: ${userId}`);
    }
  });
});

// Inicia el servidor en el puerto 3001
server.listen(3001, () => {
  console.log("Socket.IO server running on port 3001");
});