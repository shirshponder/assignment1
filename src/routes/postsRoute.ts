import { Router } from 'express';
import postsController from '../controllers/postsController';

const router = Router();

router.get('/', postsController.getAll.bind(postsController));

router.get('/:id', postsController.getById.bind(postsController));

router.post('/', postsController.create.bind(postsController));

router.delete('/:id', postsController.deleteItem.bind(postsController));

router.put('/:id', postsController.updatePostById.bind(postsController));

export default router;
