import express from "express";
 import {connectToDB} from "./DataBaseConnections/dbconnection.js";

const app = express();
const port  = 3000;

let server;

// Middleware for parsing JSON
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Hello from the server!");
});



connectToDB().then(()=>{
  console.log("Connect with DB");
    server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch((err) => console.log(err));


// Gracefully shut down the server when needed
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
  });
});


export {server};