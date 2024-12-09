import { Router } from 'express';
import crypto from 'crypto';
import { __dirname } from '../path.js';
import { promises as fs } from 'fs';
import path from 'path';

const productRouter = Router();

// Ruta de productos
const productosPath = path.resolve(__dirname, '../src/db/productos.json');

// Leer archivo de productos
const productosData = await fs.readFile(productosPath, 'utf-8');
const productos = JSON.parse(productosData);

// Listar productos
productRouter.get('/', (req, res) => {
  const { limit } = req.query;
  const limitProducts = productos.slice(0, limit); //limitar la cantidad de productos a mostrar
  res.status(200),
    res.render('template/home', {
      productos: limitProducts,
      js: 'productos.js',
      css: 'productos.css',
    });
});

// Consultar producto por id
productRouter.get('/:pid', (req, res) => {
  const idProduct = req.params.pid;
  const product = productos.find((product) => product.id == idProduct);
  if (product) {
    res.status(200).send(product);
  } else {
    res.status(404).send({ error: 'Producto no encontrado' });
  }
});

// Agregar nuevo producto
productRouter.post('/', async (req, res) => {
  const { title, description, code, price, category, stock } = req.body;

  const nuevoProducto = {
    id: crypto.randomBytes(10).toString('hex'),
    title: title,
    description: description,
    code: code,
    category: category,
    price: price,
    stock: stock,
    status: true,
    thumbnail: [],
  };

  productos.push(nuevoProducto);

  await fs.writeFile(productosPath, JSON.stringify(productos));
  res.status(201).send({
    mensaje: `nuevo producto agregado con el ID: ${nuevoProducto.id}`,
  });
});

// Actualizar producto
productRouter.put('/:pid', async (req, res) => {
  const idProduct = req.params.pid;
  const {
    title,
    description,
    code,
    price,
    category,
    stock,
    thumbnail,
    status,
  } = req.body;

  const indice = productos.findIndex((product) => product.id == idProduct);
  if (indice != -1) {
    productos[indice].title = title;
    productos[indice].description = description;
    productos[indice].code = code;
    productos[indice].category = category;
    productos[indice].price = price;
    productos[indice].stock = stock;
    productos[indice].thumbnail = thumbnail;
    productos[indice].status = status;

    await fs.writeFile(productosPath, JSON.stringify(productos));
    res.status(200).send({ mensaje: 'producto actualizado' });
  } else {
    res.status(404).send({ mensaje: 'Producto no encontrado' });
  }
});

// Eliminar producto
productRouter.delete('/:pid', async (req, res) => {
  const idProduct = req.params.pid;
  const indice = productos.findIndex((product) => product.id == idProduct);
  if (indice != -1) {
    productos.splice(indice, 1);
    await fs.writeFile(productosPath, JSON.stringify(productos));

    res.status(200).send({ mensaje: 'producto eliminado' });
  } else {
    res.status(404).send({ mensaje: 'Producto no encontrado' });
  }
});

export default productRouter; //exportar el router
