import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
      dispatch(clearReviewSuccess());
      if (reviewRef.current) reviewRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    dispatch(fetchProductById(id));
  }, [id, dispatch, reviewSuccess]);

  const addToCartHandler = () => {
    dispatch(addToCart({ id, qty }));
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (comment.trim().length < 10) {
      alert('Review must be at least 10 characters.');
      return;
    }
    dispatch(createReview({ productId: id, review: { rating, comment } }));
  };

  return (
    <>
      <div className="mb-5">
        <Link
          to="/"
          className="inline-block rounded border border-primary-500 bg-white px-3 py-1 text-sm text-primary-500 hover:bg-primary-50"
        >
          ← Back to Home
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : product ? (
        <>
          <div className="grid grid-cols-1 gap-10 py-8 px-2 md:grid-cols-[2fr_1fr] md:px-8">
            <div className="flex items-center justify-center p-4">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[550px] w-full rounded-lg object-contain shadow-md"
              />
            </div>

            <div className="rounded-lg bg-white shadow-lg">
              <div className="p-6">
                <h1 className="text-3xl font-bold text-primary-600">{product.name}</h1>
                <div className="mt-3 flex items-center gap-3">
                  <Rating value={product.rating} text={`${product.numReviews} Reviews`} />
                </div>
                <p className="mt-2 text-lg text-gray-600">
                  Brand: <b>{product.brand}</b>
                </p>
                <hr className="my-4 border-gray-200" />
                <p className="text-3xl font-bold text-primary-700">₹{product.price}</p>
                <span
                  className={`mt-2 inline-block rounded px-3 py-1 text-md ${
                    product.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
                <p className="mt-4 leading-relaxed text-gray-700">{product.description}</p>

                <div className="mt-8">
                  {product.countInStock > 0 && (
                    <div className="mb-4 flex items-center">
                      <span className="mr-4 font-bold">Quantity:</span>
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="max-w-[120px] rounded border border-primary-500 px-2 py-1"
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
                    className="w-full rounded bg-primary-500 py-3 text-lg font-medium text-white hover:bg-primary-600 disabled:opacity-50"
                  >
                    {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={reviewRef}
            className="mt-12 rounded-lg bg-white p-4 shadow-md md:p-8"
          >
            <h3 className="mb-6 text-lg font-bold text-primary-700">Customer Reviews</h3>

            {!product.reviews?.length ? (
              <Message>No Reviews Yet</Message>
            ) : (
              <div className="flex flex-col gap-6">
                {product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="rounded-md bg-gray-50 p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-200 font-semibold text-primary-800">
                        {review.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{review.name}</p>
                        <Rating value={review.rating} />
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      {review.createdAt && new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-10">
              {errorProductReview && <Message type="error">{errorProductReview}</Message>}

              {userInfo ? (
                <form onSubmit={submitHandler}>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="mb-1 block font-bold">Rating</label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full rounded border border-primary-500 px-3 py-2"
                      >
                        <option value="">Select Rating</option>
                        <option value="1">⭐ Poor</option>
                        <option value="2">⭐⭐ Fair</option>
                        <option value="3">⭐⭐⭐ Good</option>
                        <option value="4">⭐⭐⭐⭐ Very Good</option>
                        <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block font-bold">Your Review</label>
                      <textarea
                        placeholder="Write something helpful and honest..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value.slice(0, 200))}
                        className="min-h-[130px] w-full rounded border border-primary-500 px-3 py-2"
                        maxLength={200}
                      />
                      <p className="text-right text-sm text-gray-500">{comment.length} / 200 characters</p>
                    </div>
                    {comment.length > 0 && comment.length < 10 && (
                      <p className="text-sm text-red-500">Review must be at least 10 characters.</p>
                    )}
                    <button
                      type="submit"
                      disabled={comment.length < 10 || !rating}
                      className="rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600 disabled:opacity-50"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              ) : (
                <Message>
                  Please <Link to="/login" className="text-primary-600 underline">login</Link> to write a review.
                </Message>
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
