import express from 'express';
import mongoose from 'mongoose';
import { create } from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import { __dirname } from './path.js';
import productRouter from './routes/productos.js';
import multerRouter from './routes/imagenes.js';
import cartRouter from './routes/carritos.js';
import chatRouter from './routes/chat.js';
import orderRouter from './routes/orders.routers.js';
import passport from './config/passport.js';
import sessionRouter from './routes/sessions.js';

const app = express();
const handlebars = create();
const PORT = 8080;


const server = app.listen(PORT, () => {
  console.log('Server on port', PORT);
});

async function connectDB() {
  try {
    await mongoose.connect(
      'mongodb+srv://amdelavegalic:m0r3n42024@cluster-backend.lgcd4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-backend'
    );
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.log(err);
  }
}

connectDB();

// Inicializo Socket.io en el servidor
const io = new Server(server);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use('/api/sessions', sessionRouter);

app.use(express.json()); // middleware para parsear JSON
app.use(express.urlencoded({ extended: true })); // middleware para parsear URL-encoded

// Configuración de handlebars

app.engine('handlebars', handlebars.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/public', express.static(path.join(__dirname, 'public'))); // middleware para archivos estáticos
app.use('/api/products', productRouter); // middleware para rutas
app.use('/api/carts', cartRouter); // middleware para rutas
app.use('/api/chat', chatRouter); // middleware para rutas
app.use('/api/orders', orderRouter); // middleware para rutas
app.use('/upload', multerRouter); // middleware para subir archivos

export default app;