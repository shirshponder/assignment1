import { Router } from 'express';
import {
  createComment,
  getAllComments,
} from '../controllers/commentsController.js';

const router = Router();

router.post('/', createComment);

router.get('/', getAllComments);

export default router;
