import { Router } from 'express';
import commentsController from '../controllers/commentsController';

const router = Router();

router.get('/', commentsController.getAll.bind(commentsController));

router.get('/:id', commentsController.getById.bind(commentsController));

router.post('/', commentsController.create.bind(commentsController));

router.put(
  '/:id',
  commentsController.updateCommentById.bind(commentsController)
);

router.delete('/:id', commentsController.deleteItem.bind(commentsController));

export default router;
