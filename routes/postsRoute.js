import { Router } from "express";
import { getPosts, getPostById, createPost } from "../controllers/postsController.js";

const router = Router();
router.get("/", getPosts);

router.get("/:id", getPostById);

router.post("/", createPost);

export default router;
