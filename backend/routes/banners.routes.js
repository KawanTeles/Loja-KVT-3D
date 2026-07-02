import express from 'express';
import { getConfig, updateConfig } from '../controllers/banners.controller.js';

const router = express.Router();

router.get('/', getConfig);
router.put('/', updateConfig);

export default router;
