import { Router } from 'express';
import {
  createComment,
  deleteCommentById,
  updateCommentById,
} from '../controllers/commentsController.js';

const router = Router();

router.post('/', createComment);

router.put('/:id', updateCommentById);

router.delete('/:id', deleteCommentById);

export default router;
