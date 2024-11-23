import { Router } from 'express';
import {
  createComment,
  deleteCommentById,
  getAllComments,
  updateCommentById,
} from '../controllers/commentsController.js';

const router = Router();

router.post('/', createComment);

router.get('/', getAllComments);

router.put('/:id', updateCommentById);

router.delete('/:id', deleteCommentById);

export default router;
