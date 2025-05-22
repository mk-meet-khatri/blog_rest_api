const http = require("http");
const app = require("./app");
const { port } = require("./config/keys");

// creating server
const server = http.createServer(app);

server.listen(8000, () => console.log(`Server is running on Port : ${port}`));
