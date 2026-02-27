import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToCart, addItem, removeItem } from '../store/slices/cartSlice';
import Message from '../components/Message';
import { IoTrashBinSharp } from 'react-icons/io5';

export default function CartScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const qty = searchParams.get('qty');

  const { cartItems } = useSelector((state) => state.cart);

  useEffect(() => {
    if (id && qty) {
      dispatch(addToCart({ id, qty: Number(qty) }));
      toast.success('Item added to cart');
    }
  }, [dispatch, id, qty]);

  const removeFromCartHandler = (productId) => {
    dispatch(removeItem(productId));
    toast.info('Item removed from cart');
  };

  const updateQtyHandler = (productId, newQty) => {
    const item = cartItems.find((i) => i.product === productId);
    if (item) {
      dispatch(addItem({ ...item, qty: Number(newQty) }));
      toast.success('Quantity updated');
    }
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 md:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-800 sm:mb-8 sm:text-3xl">Shopping Cart</h1>
      <div className="flex w-full flex-col gap-6 sm:gap-8">
        {cartItems.length === 0 ? (
          <Message>Your cart is empty. Add some products to get started!</Message>
        ) : (
          <div className="grid w-full gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
            <div className="flex w-full flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="grid w-full grid-cols-[auto_1fr_auto_auto_auto] gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:gap-4 sm:p-5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover sm:h-20 sm:w-20"
                  />
                  <div className="min-w-0 flex flex-col justify-center">
                    <Link
                      to={`/products/${item.product}`}
                      className="font-medium text-slate-800 line-clamp-2 hover:text-primary-600 sm:text-lg"
                    >
                      {item.name}
                    </Link>
                    <span className="mt-1 text-sm font-semibold text-primary-600 sm:text-base">₹{item.price}</span>
                  </div>
                  <div className="flex items-center">
                    <select
                      value={item.qty}
                      onChange={(e) => updateQtyHandler(item.product, e.target.value)}
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm font-medium focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    >
                      {[...Array(item.countInStock).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center font-semibold text-slate-700 sm:text-lg">
                    ₹{item.price * item.qty}
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => removeFromCartHandler(item.product)}
                      className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <IoTrashBinSharp className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky top-20 flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-md sm:p-6 lg:top-24">
              <h2 className="mb-4 text-xl font-bold text-slate-800 sm:text-2xl">Summary</h2>
              <p className="mb-2 text-sm text-slate-600">
                {cartItems.reduce((acc, c) => acc + c.qty, 0)} item(s)
              </p>
              <p className="mb-6 text-2xl font-bold text-primary-600 sm:text-3xl">
                ₹{cartItems.reduce((acc, c) => acc + c.price * c.qty, 0)}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                  className="w-full rounded-lg bg-primary-500 py-3 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50 sm:text-base"
                >
                  Proceed to Checkout
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full rounded-lg border border-slate-300 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:text-base"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
