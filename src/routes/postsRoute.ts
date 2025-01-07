import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePostById,
} from '../controllers/postsController';

const router = Router();

router.get('/', getPosts);

router.get('/:id', getPostById);

router.post('/', createPost);

router.put('/:id', updatePostById);

export default router;
