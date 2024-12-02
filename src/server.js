/* 

import http from 'http';
const port = 3000; // puerto donde va a escuchar el servidor

const server = http.createServer((req, res) => {
  res.end('ni hola ni chauchas');
});

server.listen(port, () => {
  console.log(`Server on port ${port}`);
}); // el servidor escucha en el puerto 3000

*/

import express from 'express';

const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
  res.send('Hola mundo con express');
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
}); // el servidor escucha en el puerto 8080
