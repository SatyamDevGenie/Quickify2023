import express from 'express';
import {
  getReviewSummary,
  shoppingAssistant,
  generateProductDescription,
} from '../controllers/aiController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/products/:id/review-summary', getReviewSummary);
router.post('/chat', shoppingAssistant);
router.post('/products/:id/generate-description', protect, admin, generateProductDescription);

export default router;
