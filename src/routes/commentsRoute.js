import { Router } from 'express';
import {
  createComment,
  getAllComments,
  updateCommentById,
  getCommentsByPost,
} from '../controllers/commentsController.js';

const router = Router();

router.get('/', getAllComments);

router.get('/post/:id', getCommentsByPost);

router.post('/', createComment);

router.put('/:id', updateCommentById);

export default router;
