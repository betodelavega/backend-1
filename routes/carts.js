import { Router } from 'express';
import fs from 'fs';

const router = Router();
const cartsFile = './data/carts.json';

// Función auxiliar para leer carritos del archivo
const readCarts = () => {
  const data = fs.readFileSync(cartsFile);
  return JSON.parse(data);
};

// Función auxiliar para escribir carritos en el archivo
const writeCarts = (carts) => {
  fs.writeFileSync(cartsFile, JSON.stringify(carts, null, 2));
};

// POST /api/carts - Crear un nuevo carrito
router.post('/', (req, res) => {
  const carts = readCarts();
  const newCart = {
    id: (carts.length + 1).toString(),
    products: []
  };
  carts.push(newCart);
  writeCarts(carts);
  res.status(201).json(newCart);
});

// GET /api/carts/:cid - Listar productos en un carrito
router.get('/:cid', (req, res) => {
  const carts = readCarts();
  const cart = carts.find(c => c.id === req.params.cid);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// POST /api/carts/:cid/product/:pid - Agregar producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
  const carts = readCarts();
  const cart = carts.find(c => c.id === req.params.cid);
  if (cart) {
    const productIndex = cart.products.findIndex(p => p.product === req.params.pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }
    writeCarts(carts);
    res.status(201).json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

export default router;