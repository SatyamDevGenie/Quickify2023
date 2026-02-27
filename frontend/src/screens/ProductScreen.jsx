import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  fetchProductById,
  createReview,
  clearReviewSuccess,
} from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Rating from '../components/Rating';

export default function ProductScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const reviewRef = useRef(null);

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { selectedProduct: product, productLoading: loading, productError: error } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);
  const { reviewSuccess, reviewError: errorProductReview } = useSelector((state) => state.products);

  useEffect(() => {
    if (reviewSuccess) {
      setRating(0);
      setComment('');
      toast.success('Review submitted successfully.');
      dispatch(clearReviewSuccess());
      if (reviewRef.current) reviewRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    dispatch(fetchProductById(id));
  }, [id, dispatch, reviewSuccess]);

  useEffect(() => {
    if (errorProductReview) toast.error(errorProductReview);
  }, [errorProductReview]);

  const addToCartHandler = () => {
    dispatch(addToCart({ id, qty }));
    toast.success('Added to cart');
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (comment.trim().length < 10) {
      toast.warning('Review must be at least 10 characters.');
      return;
    }
    dispatch(createReview({ productId: id, review: { rating, comment } }));
  };

  return (
    <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
      <Link
        to="/"
        className="mb-4 inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        ← Back to products
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : product ? (
        <>
          <div className="grid grid-cols-1 gap-6 py-6 md:grid-cols-[1fr_1fr] md:gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[400px] w-full rounded-lg object-contain sm:max-h-[500px]"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">{product.name}</h1>
              <div className="mt-2 flex items-center gap-2">
                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
              </div>
              <p className="mt-2 text-slate-600">
                Brand: <strong>{product.brand}</strong>
              </p>
              <hr className="my-4 border-slate-200" />
              <p className="text-2xl font-bold text-primary-600 sm:text-3xl">₹{product.price}</p>
              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                  product.countInStock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
              <p className="mt-4 text-slate-600 leading-relaxed">{product.description}</p>

              <div className="mt-6">
                {product.countInStock > 0 && (
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">Qty:</span>
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </select>
                  </div>
                )}
                <button
                  type="button"
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="w-full rounded-lg bg-primary-500 py-3 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50 sm:text-base"
                >
                  {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>

          <div
            ref={reviewRef}
            className="mt-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:mt-10 sm:p-6 md:p-8"
          >
            <h3 className="mb-4 text-lg font-bold text-slate-800 sm:mb-6">Reviews</h3>

            {!product.reviews?.length ? (
              <Message>No reviews yet. Be the first to review!</Message>
            ) : (
              <div className="flex flex-col gap-4 sm:gap-6">
                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-200 font-semibold text-primary-800">
                        {review.name?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800">{review.name}</p>
                        <Rating value={review.rating} />
                      </div>
                    </div>
                    <p className="mt-2 text-slate-600">{review.comment}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {review.createdAt && new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              {errorProductReview && <Message type="error">{errorProductReview}</Message>}

              {userInfo ? (
                <form onSubmit={submitHandler} className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option value="">Select rating</option>
                      <option value="1">⭐ Poor</option>
                      <option value="2">⭐⭐ Fair</option>
                      <option value="3">⭐⭐⭐ Good</option>
                      <option value="4">⭐⭐⭐⭐ Very Good</option>
                      <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Your review</label>
                    <textarea
                      placeholder="Write something helpful (min 10 characters)..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value.slice(0, 200))}
                      className="min-h-[100px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                      maxLength={200}
                    />
                    <p className="mt-1 text-right text-xs text-slate-500">{comment.length}/200</p>
                  </div>
                  {comment.length > 0 && comment.length < 10 && (
                    <p className="text-sm text-amber-600">Review must be at least 10 characters.</p>
                  )}
                  <button
                    type="submit"
                    disabled={comment.length < 10 || !rating}
                    className="rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50"
                  >
                    Submit Review
                  </button>
                </form>
              ) : (
                <Message>
                  Please <Link to="/login" className="font-medium text-primary-600 underline">sign in</Link> to write a review.
                </Message>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
