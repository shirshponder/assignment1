import { Router } from 'express';
import commentsController from '../controllers/commentsController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - sender
 *         - postId
 *       properties:
 *         content:
 *           type: string
 *           description: The comment content
 *         sender:
 *           type: string
 *           description: The comment sender
 *         postId:
 *           type: string
 *           description: The comment postId
 *       example:
 *         content: 'This is a comment'
 *         sender: 'shir'
 *         postId: '60f1b0b3b3f3b40015f1f3b3'
 */

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     description: Returns the list of all the comments
 *     tags:
 *       - Comments
 *     responses:
 *       '200':
 *         description: A list of the comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       '500':
 *         description: Server error
 */
router.get('/', commentsController.getAll.bind(commentsController));

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get comment by ID
 *     description: Returns single comment
 *     tags:
 *       - Comments
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID of the comment
 *     responses:
 *       '200':
 *         description: A comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       '404':
 *         description: Comment not found
 *       '500':
 *         description: Server error
 */
router.get('/:id', commentsController.getById.bind(commentsController));

router.post('/', commentsController.create.bind(commentsController));

router.put('/:id', commentsController.updateItem.bind(commentsController));

router.delete('/:id', commentsController.deleteItem.bind(commentsController));

export default router;
