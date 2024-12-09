import { Router } from 'express';
import crypto from 'crypto';
import { __dirname } from '../path.js';
import { promises as fs } from 'fs';
import path from 'path';

const cartRouter = Router();

const carritosPath = path.resolve(__dirname, '../src/db/carritos.json');

// Leer archivo de carritos
const carritosData = await fs.readFile(carritosPath, 'utf-8');
const carts = JSON.parse(carritosData);

// Listar carritos
cartRouter.get('/:cid', (req, res) => {
  const idCart = req.params.cid;
  const cart = carts.find((cart) => cart.id == idCart);
  if (cart) {
    res.status(200).send(cart.products);
  } else {
    res.status(404).send({ mensaje: 'El carrito no encontrado' });
  }
});

// Agregar nuevo carrito
cartRouter.post('/', async (req, res) => {
  const newCart = {
    id: crypto.randomBytes(5).toString('hex'),
    //timestamp: Date.now(),
    products: [],
  };
  carts.push(newCart);
  await fs.writeFile(carritosPath, JSON.stringify(carritos));
  res.status(200).send(`Carrito creado correctamente con el id ${newCart.id}`);
});

cartRouter.post('/:cid/products/:pid', async (req, res) => {
  const idCart = req.params.cid;
  const idProduct = req.params.pid;
  const { quantity } = req.body;

  const cart = carts.find((cart) => cart.id == idCart);
  if (cart) {
    const indice = cart.products.findIndex(
      (product) => product.id == idProduct
    );
    if (indice != -1) {
      cart.products[indice].quantity = quantity;
    } else {
      //Si el producto no existe, lo creo y lo guardo
      cart.products.push({ id: idProduct, quantity: quantity });
    }
    await fs.writeFile(carritosPath, JSON.stringify(carritos));
    res.status(200).send('nuevo producto agregado al carrito');
  } else {
    res.status(404).send({ mensaje: 'El carrito no existente' });
  }
});

/*cartRouter.delete('/:cid/products/:pid', (req, res) => {
  const idCart = req.params.cid;
  const idProduct = req.params.pid;
  const cart = carts.find((cart) => cart.id == idCart);
  if (cart) {
    const indice = cart.products.findIndex(
      (product) => product.id == idProduct
    );
    if (indice != -1) {
      cart.products.splice(indice, 1);
      res.status(200).send({ mensaje: 'Producto eliminado del carrito' });
    } else {
      res.status(404).send({ mensaje: 'Producto no encontrado en el carrito' });
    }
  } else {
    res.status(404).send({ mensaje: 'El carrito no encontrado' });
  }
});
*/
export default cartRouter;
