import { Router } from 'express';
import {
  createComment,
  updateCommentById,
} from '../controllers/commentsController.js';

const router = Router();

router.post('/', createComment);

router.put('/:id', updateCommentById);

export default router;
