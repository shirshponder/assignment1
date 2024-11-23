import { Router } from 'express';
import {
  createComment,
  getComments,
  deleteCommentById,
  updateCommentById,
  getCommentById,
} from '../controllers/commentsController.js';

const router = Router();

router.get('/', getComments);

router.post('/', createComment);

router.put('/:id', updateCommentById);

router.get('/:id', getCommentById);

router.delete('/:id', deleteCommentById);

export default router;
