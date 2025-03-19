// Import the 'express' module
import express from 'express';
import http from 'http';
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();

import { setupSocket } from './socket';

const port = process.env.PORT;

const app = express();
app.use(cors());
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('Hello, TypeScript + Node.js + Express!');
});

setupSocket(server);

app.use('*', (req, res) => { res.status(200).send({ st: 'true' }) });

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

