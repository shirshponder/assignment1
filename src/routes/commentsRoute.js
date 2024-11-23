import { Router } from 'express';
import {
  createComment,
  updateCommentById,
  getCommentById,
} from '../controllers/commentsController.js';

const router = Router();

router.post('/', createComment);

router.put('/:id', updateCommentById);

router.get('/:id', getCommentById);

export default router;
