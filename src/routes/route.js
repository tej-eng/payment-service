// src/routes/auth.routes.js
import express from "express";
import {createOrder} from "../controllers/paymentController.js";

const router = express.Router();

// Public routes
router.post("/api/createOrder", createOrder);


export default router;
