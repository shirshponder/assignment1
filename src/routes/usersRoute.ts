import { Router } from 'express';
import usersController from '../controllers/usersController';

const router = Router();

router.get('/', usersController.getAll.bind(usersController));

router.get('/:id', usersController.getById.bind(usersController));

router.post('/', usersController.create.bind(usersController));

router.delete('/:id', usersController.deleteItem.bind(usersController));

router.put('/:id', usersController.updateItem.bind(usersController));

export default router;
