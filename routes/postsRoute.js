import { Router } from 'express';
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePostById,
} from '../controllers/postsController.js';

const router = Router();
router.get('/', getAllPosts);

router.get('/:id', getPostById);

router.post('/', createPost);

router.put('/:id', updatePostById);

export default router;
