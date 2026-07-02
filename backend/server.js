import app from './app.js';
import logger from './services/logger.service.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`==================================================`);
  logger.info(`  BACKEND DE SINCRONIZAÇÃO DA LOJA KVT-3D         `);
  logger.info(`  Servidor rodando em: http://localhost:${PORT}     `);
  logger.info(`  Health check: http://localhost:${PORT}/health     `);
  logger.info(`==================================================`);
});
