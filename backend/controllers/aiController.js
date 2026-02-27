import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { getCompletion } from '../utils/groqService.js';

/**
 * @desc   AI summary of product reviews (GROQ)
 * @route  GET /api/ai/products/:id/review-summary
 * @access public
 */
export const getReviewSummary = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).select('name reviews');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const reviews = product.reviews || [];
  if (reviews.length === 0) {
    return res.json({ summary: null, message: 'No reviews to summarize.' });
  }

  const reviewsText = reviews
    .map((r) => `Rating ${r.rating}/5: ${r.comment}`)
    .join('\n');

  const systemPrompt = `You are a helpful shopping assistant. Summarize customer reviews in 2-4 short, neutral sentences. Mention common praise and any repeated complaints. No bullet points, plain paragraphs only.`;
  const userPrompt = `Product: ${product.name}\n\nReviews:\n${reviewsText}\n\nSummarize these reviews:`;

  const summary = await getCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  res.json({ summary });
});

/**
 * @desc   AI shopping assistant – chat with product catalog context (GROQ)
 * @route  POST /api/ai/chat
 * @access public
 * @body   { "message": "user message", "productIds": ["id1", "id2"] (optional) }
 */
export const shoppingAssistant = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    res.status(400);
    throw new Error('Message is required');
  }

  const products = await Product.find({ countInStock: { $gt: 0 } })
    .select('name price brand category description')
    .limit(80)
    .lean();

  const catalogSummary = products
    .map((p) => `- ${p.name} (${p.brand}, ${p.category}): ₹${p.price}. ${(p.description || '').slice(0, 120)}...`)
    .join('\n');

  const systemPrompt = `You are a friendly shopping assistant for an e-commerce store. Use ONLY the product catalog below to answer. Recommend products by name when relevant. Keep replies concise (2-4 sentences). If the user asks for something not in the catalog, say we don't have that and suggest something similar from the list. Do not make up products or prices. Currency is INR (₹).`;

  const userPrompt = `Current product catalog:\n${catalogSummary}\n\nUser question: ${message}`;

  const reply = await getCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  res.json({ reply });
});

/**
 * @desc   Generate product description (admin) using GROQ
 * @route  POST /api/ai/products/:id/generate-description
 * @access private/admin
 */
export const generateProductDescription = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).select(
    'name brand category price description'
  );
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const systemPrompt =
    'You are a copywriter for an Indian e-commerce store. Write a concise, compelling product description in English, optimized for online shopping. Use 2 short paragraphs, friendly and clear. Do not add headings or bullet points. Keep it under 120 words. Prices are in INR (₹) but do not restate the price.';

  const userPrompt = `Product details:
Name: ${product.name}
Brand: ${product.brand || 'N/A'}
Category: ${product.category || 'N/A'}
Price: ₹${product.price}
Existing description (may be rough or empty): ${product.description || 'None'}

Rewrite or generate a better description for this product.`;

  const description = await getCompletion([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);

  res.json({ description });
});
