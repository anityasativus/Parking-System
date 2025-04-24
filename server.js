const express = require("express");
const http = require("http");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = new SerialPort({ path: "COM5", baudRate: 9600 }); 
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

app.use(express.static("public")); 

parser.on("data", (data) => {
  console.log("Arduino:", data);
  io.emit("arduino-data", data); 
});

io.on("connection", (socket) => {
  console.log("Client connected");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
