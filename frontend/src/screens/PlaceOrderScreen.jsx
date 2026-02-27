import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createOrder } from '../store/slices/ordersSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';

export default function PlaceOrderScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { createdOrder, createLoading, createError } = useSelector((state) => state.orders);
  const { userInfo } = useSelector((state) => state.auth);

  const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice < 10000 ? 5000 : 0;
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  useEffect(() => {
    if (!userInfo) navigate('/login');
    if (createdOrder) {
      toast.success('Order placed successfully!');
      navigate(`/order/${createdOrder._id}`, { state: { orderPlaced: true } });
    }
  }, [navigate, createdOrder, userInfo]);

  useEffect(() => {
    if (createError) toast.error(createError);
  }, [createError]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  return (
    <div className="mx-auto max-w-6xl flex w-full flex-col px-3 py-6 sm:py-8 md:px-6">
      <CheckoutSteps step1 step2 step3 step4 />

      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[2.5fr_1fr] lg:gap-8">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-3 text-lg font-bold text-slate-800 sm:text-xl">Shipping</h2>
            <p className="text-sm text-slate-600 sm:text-base">
              {cart.shippingAddress?.address}, {cart.shippingAddress?.city},{' '}
              {cart.shippingAddress?.postalCode}, {cart.shippingAddress?.country}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-3 text-lg font-bold text-slate-800 sm:text-xl">Payment</h2>
            <p className="text-sm font-medium text-slate-700 sm:text-base">{(cart.paymentMethod || 'paypal').toUpperCase()}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-3 text-lg font-bold text-slate-800 sm:text-xl">Items</h2>
            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty.</Message>
            ) : (
              <div className="flex flex-col gap-3">
                {cart.cartItems.map((item, idx) => (
                  <div key={idx} className="flex w-full items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 shrink-0 rounded-lg object-cover sm:h-14 sm:w-14"
                      />
                      <Link
                        to={`/products/${item.product}`}
                        className="truncate text-sm font-medium text-slate-800 hover:text-primary-600 sm:text-base"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-slate-700">
                      {item.qty} × ₹{item.price} = ₹{item.qty * item.price}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-md sm:p-6 lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-4 text-xl font-bold text-slate-800">Order Summary</h2>

          <div className="flex flex-col gap-3 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="text-slate-600">Items</span>
              <span className="font-medium">₹{itemsPrice}</span>
            </div>
            <hr className="border-slate-200" />
            <div className="flex justify-between">
              <span className="text-slate-600">Shipping</span>
              <span className="font-medium">₹{shippingPrice}</span>
            </div>
            <hr className="border-slate-200" />
            <div className="flex justify-between">
              <span className="text-slate-600">Tax</span>
              <span className="font-medium">₹{taxPrice}</span>
            </div>
            <hr className="border-slate-200" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary-600">₹{totalPrice}</span>
            </div>
          </div>

          {createError && <Message type="error" className="mt-4">{createError}</Message>}

          <button
            type="button"
            onClick={placeOrderHandler}
            disabled={cart.cartItems.length === 0 || createLoading}
            className="mt-6 w-full rounded-lg bg-primary-500 py-3 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50 sm:text-base"
          >
            {createLoading ? 'Placing order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
