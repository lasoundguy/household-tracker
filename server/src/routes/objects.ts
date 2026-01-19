import express from 'express';
import {
  getAllObjects,
  getObjectById,
  createObject,
  updateObject,
  deleteObject,
} from '../controllers/objectsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllObjects);
router.get('/:id', getObjectById);
router.post('/', createObject);
router.put('/:id', updateObject);
router.delete('/:id', deleteObject);

export default router;
