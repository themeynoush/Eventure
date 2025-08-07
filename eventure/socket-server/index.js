const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 4001;

const httpServer = createServer();
const io = new Server(httpServer, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("message:send", (msg) => {
    io.emit("message:new", msg);
  });
  socket.on("presence:update", (presence) => {
    socket.broadcast.emit("presence:updated", presence);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket server listening on :${PORT}`);
});