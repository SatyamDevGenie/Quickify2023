# AI Features in CartBuddy (GROQ API)

Your app uses **GROQ_API_KEY** from `.env` for fast LLM features. Below is what’s implemented and what you can add.

---

## Implemented (in this project)

### 1. **AI Review Summary** (product page)
- **Where:** Product screen, above the list of reviews.
- **What:** Calls GROQ to summarize all reviews for that product in 2–4 sentences (praise + complaints).
- **API:** `GET /api/ai/products/:id/review-summary`
- **Backend:** `backend/controllers/aiController.js` → `getReviewSummary`, `backend/utils/groqService.js`

### 2. **AI Shopping Assistant** (chat widget)
- **Where:** Floating chat button (bottom-right) on every page.
- **What:** User asks in natural language (e.g. “Best laptop under 50k”, “Gift for dad”). The AI uses your **current product catalog** (name, brand, category, price, short description) to recommend products. Replies are short and in INR (₹).
- **API:** `POST /api/ai/chat` with body `{ "message": "user question" }`
- **Backend:** `aiController.js` → `shoppingAssistant`
- **Frontend:** `frontend/src/components/AIChatWidget.jsx`

---

## More GROQ ideas you can add

| Feature | Description | How (high level) |
|--------|-------------|------------------|
| **Natural language search** | “Cheap wireless earbuds”, “red dress under 2000” | Backend: parse query with GROQ or map to filters; return product IDs. Frontend: search bar that calls this and shows results. |
| **“Why recommended”** | On “Recommended for you” or related products, show one short AI line: “Recommended because you viewed X” | When building recommendation list, call GROQ with product names + context; return 1 sentence per product. |
| **Product description generator** | Admin: one-click “Generate description” from name/brand/category | Backend: `POST /api/ai/products/:id/suggest-description`; GROQ returns a draft; admin can edit and save. |
| **FAQ / support bot** | “Where is my order?” “How do I return?” | Same chat UI; new backend route that has FAQs + optional order lookup; GROQ answers from that context. |
| **Review sentiment / highlights** | “Most liked”, “Common concern” tags per product | Like review summary; prompt GROQ to return 3–4 short “pros” and “cons” from reviews; store or show on product page. |
| **Personalized homepage copy** | “Hi [Name], here are picks for you” with 1–2 lines of reasoning | When user is logged in, pass “recent views” or “last order” to GROQ; return 1–2 sentences; show above product grid. |

---

## Tech notes

- **GROQ endpoint:** `https://api.groq.com/openai/v1/chat/completions` (OpenAI-compatible).
- **Model used:** `llama-3.1-8b-instant` (fast, good for chat/summaries). You can switch in `backend/utils/groqService.js` (e.g. `mixtral-8x7b-32768` for heavier tasks).
- **Security:** Never expose `GROQ_API_KEY` to the frontend. All GROQ calls must go from your **backend** (Node). Frontend only calls your APIs (`/api/ai/...`).
- **CORS:** If the frontend runs on a different origin (e.g. Vite on port 5173), add it in `backend/server.js` in the `cors` `origin` array.

---

## Quick test

1. **Review summary:** Open any product that has reviews; you should see an “AI Summary” box above the reviews.
2. **Shopping assistant:** Click the chat icon (bottom-right), type e.g. “What do you have under 1000?” or “Best product for gaming?” and send. Reply should mention real products from your catalog.

If the backend is not running or `GROQ_API_KEY` is missing, the summary will stay empty and the chat will show an error toast.
