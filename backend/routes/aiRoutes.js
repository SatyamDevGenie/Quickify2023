import express from 'express';
import {
  getReviewSummary,
  shoppingAssistant,
  generateProductDescription,
  getBuyVerdict,
} from '../controllers/aiController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/products/:id/review-summary', getReviewSummary);
router.get('/products/:id/buy-verdict', getBuyVerdict);
router.post('/chat', shoppingAssistant);
router.post('/products/:id/generate-description', protect, admin, generateProductDescription);

export default router;
