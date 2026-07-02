import express from 'express';
import cors from 'cors';
import productsRoutes from './routes/products.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import configRoutes from './routes/banners.routes.js';
import syncRoutes from './routes/sync.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Route handlers mapping
app.use('/api/produtos', productsRoutes);
app.use('/api/categorias', categoriesRoutes);
app.use('/api/config', configRoutes); // Mount banners/configs here to match client fetch endpoints
app.use('/api/sync', syncRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend de sincronização rodando com sucesso.',
    timestamp: new Date().toISOString()
  });
});

export default app;
