import { Router } from "express";
import authRoutes from "./auth.routes.js";
import conversationRoutes from './conversation.routes.js'

const router = Router();
// this middelware It tells the browser and intermediate caches: "Do not store this response in the cache."
// bcoz Authentication routes can return sensitive information, such as:
router.use("/auth",(_req, res, next) => {
    res.set('Cache-control', 'no-store');
    next()
}, authRoutes);

router.use("/conversation", conversationRoutes)


export default router;
