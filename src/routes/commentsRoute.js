import { Router } from 'express';
import {
  createComment,
  getComments,
  updateCommentById,
} from '../controllers/commentsController.js';

const router = Router();

router.get('/', getComments);

router.post('/', createComment);

router.put('/:id', updateCommentById);

export default router;
