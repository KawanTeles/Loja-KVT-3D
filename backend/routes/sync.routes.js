import express from 'express';
import { handleManualSync } from '../controllers/sync.controller.js';

const router = express.Router();

router.post('/', handleManualSync);

export default router;
