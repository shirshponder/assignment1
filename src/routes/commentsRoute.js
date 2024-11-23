import { Router } from 'express';
import {
  createComment,
  getAllComments,
  updateCommentById,
} from '../controllers/commentsController.js';

const router = Router();

router.post('/', createComment);

router.get('/', getAllComments);

router.put('/:id', updateCommentById);

export default router;
