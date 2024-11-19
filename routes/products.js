import { Router } from 'express';
import fs from 'fs';

const router = Router();
const productsFile = './data/products.json';

// Función auxiliar para leer productos del archivo
const readProducts = () => {
  const data = fs.readFileSync(productsFile);
  return JSON.parse(data);
};

// Función auxiliar para escribir productos en el archivo
const writeProducts = (products) => {
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
};

// GET /api/products - Listar todos los productos
router.get('/', (req, res) => {
  const products = readProducts();
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.json(products.slice(0, limit));
});

// GET /api/products/:productId - Obtener producto por ID
router.get('/:productId', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === req.params.productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// POST /api/products - Agregar un nuevo producto
router.post('/', (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: (products.length + 1).toString(),
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: req.body.price,
    status: req.body.status !== undefined ? req.body.status : true,
    stock: req.body.stock,
    category: req.body.category,
    thumbnails: req.body.thumbnails || []
  };
  products.push(newProduct);
  writeProducts(products);
  res.status(201).json(newProduct);
});

// PUT /api/products/:productId - Actualizar un producto
router.put('/:productId', (req, res) => {
  const products = readProducts();
  const productIndex = products.findIndex(p => p.id === req.params.productId);
  if (productIndex !== -1) {
    const updatedProduct = { ...products[productIndex], ...req.body, id: products[productIndex].id };
    products[productIndex] = updatedProduct;
    writeProducts(products);
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// DELETE /api/products/:productId - Eliminar un producto
router.delete('/:productId', (req, res) => {
  const products = readProducts();
  const newProducts = products.filter(p => p.id !== req.params.productId);
  if (newProducts.length !== products.length) {
    writeProducts(newProducts);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

export default router;

