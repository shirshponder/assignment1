import { Router } from 'express';
import {
  createComment,
  deleteCommentById,
  getAllComments,
  updateCommentById,
  getCommentById,
} from '../controllers/commentsController.js';

const router = Router();

router.post('/', createComment);

router.get('/', getAllComments);

router.put('/:id', updateCommentById);

router.get('/:id', getCommentById);

router.delete('/:id', deleteCommentById);


export default router;
