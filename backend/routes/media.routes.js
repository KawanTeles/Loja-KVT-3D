import express from 'express';
import multer from 'multer';
import { getMedia, deleteMedia, uploadMedia } from '../controllers/media.controller.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getMedia);
router.delete('/', deleteMedia);
router.post('/upload', upload.array('files'), uploadMedia);

export default router;
