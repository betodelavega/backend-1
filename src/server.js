import express from 'express';
import { create } from 'express-handlebars';
import { Server } from 'socket.io';
import { __dirname } from './path.js';
import productRouter from './routes/productos.js';
import multerRouter from './routes/imagenes.js';
import cartRouter from './routes/carritos.js';
import path from 'path';

const app = express();
const handlebars = create();
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log('Server on port', PORT);
});

// Inicializo Socket.io en el servidor
const io = new Server(server);

app.use(express.json()); // middleware para parsear JSON
app.use(express.urlencoded({ extended: true })); // middleware para parsear URL-encoded

// Configuración de handlebars
app.engine('handlebars', handlebars.engine);

// Directorio de las vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars'); // o el motor de vistas que estés usando

app.use('/public', express.static(path.join(__dirname, 'public'))); // middleware para archivos estáticos
app.use('/api/products', productRouter); // middleware para rutas
app.use('/api/carts', cartRouter); // middleware para rutas
app.use('/upload', multerRouter); // middleware para subir archivos

app.get('/', (req, res) => {
  res.status(200).send('Ok');
});
