import express from 'express';
import multer from 'multer';
import { uploadImage, deleteImage } from '../controllers/uploadController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.use(authenticateToken);

router.post('/', upload.single('image'), uploadImage);
router.delete('/', deleteImage);

export default router;
