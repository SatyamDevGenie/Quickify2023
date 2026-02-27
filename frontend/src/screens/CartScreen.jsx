import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
    }
  }, [dispatch, id, qty]);

  const removeFromCartHandler = (productId) => {
    dispatch(removeItem(productId));
  };

  const updateQtyHandler = (productId, newQty) => {
    const item = cartItems.find((i) => i.product === productId);
    if (item) dispatch(addItem({ ...item, qty: Number(newQty) }));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="mx-auto max-w-7xl py-10 px-4">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      <div className="flex w-full flex-col gap-8">
        {cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="grid w-full gap-8 sm:grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr]">
            <div className="flex w-full flex-col gap-6">
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="grid w-full grid-cols-1 gap-6 rounded-lg bg-white p-4 shadow-sm hover:shadow-md sm:grid-cols-1 md:grid-cols-[1fr_3fr_1fr_1fr]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded object-cover"
                  />
                  <div className="flex items-center">
                    <Link to={`/products/${item.product}`} className="font-medium text-lg line-clamp-2 text-gray-900 hover:text-primary-600">
                      {item.name}
                    </Link>
                  </div>
                  <div className="flex items-center font-bold text-lg text-blue-600">
                    ₹{item.price}
                  </div>
                  <div className="flex items-center">
                    <select
                      value={item.qty}
                      onChange={(e) => updateQtyHandler(item.product, e.target.value)}
                      className="w-[70px] rounded border border-gray-300 px-2 py-1 text-sm font-semibold"
                    >
                      {[...Array(item.countInStock).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => removeFromCartHandler(item.product)}
                      className="rounded border border-red-500 p-1 text-red-500 hover:bg-red-600 hover:text-white"
                    >
                      <IoTrashBinSharp className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="sticky top-10 flex flex-col items-center rounded-lg bg-gray-50 p-8 shadow-md">
              <h2 className="mb-4 text-2xl font-bold">Cart Summary</h2>
              <p className="mb-4 font-bold text-lg text-gray-700">
                Subtotal ({cartItems.reduce((acc, c) => acc + c.qty, 0)} items)
              </p>
              <p className="mb-6 font-bold text-3xl text-green-600">
                ₹ {cartItems.reduce((acc, c) => acc + c.price * c.qty, 0)}
              </p>
              <div className="flex w-full flex-col gap-4">
                <button
                  type="button"
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                  className="w-full rounded bg-primary-500 py-3 text-lg font-medium text-white hover:bg-primary-700 disabled:opacity-50"
                >
                  Proceed to Checkout
                </button>
                <hr className="border-gray-200" />
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full rounded border border-gray-300 py-3 text-lg hover:bg-gray-100"
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
