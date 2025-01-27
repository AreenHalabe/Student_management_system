import express from "express";
 import {connectToDB} from "./DataBaseConnections/dbconnection.js";
import bodyParser from "body-parser";
import cors from "cors";
import { StudentRoute } from "./routes/studentRoute.js";

const app = express();
const port  = 3000;

let server;
app.use(bodyParser.json());
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(StudentRoute);



connectToDB().then(()=>{
  console.log("Connect with DB");
    server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch((err) => console.log(err));


process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
  });
});


export {server};