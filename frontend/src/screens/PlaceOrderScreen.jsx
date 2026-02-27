import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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
    if (createdOrder) navigate(`/order/${createdOrder._id}`);
  }, [navigate, createdOrder, userInfo]);

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
    <div className="flex w-full flex-col py-10 px-4 md:px-8">
      <CheckoutSteps step1 step2 step3 step4 />

      <div className="mt-8 grid gap-8 lg:grid-cols-[2.5fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold">Shipping Information</h2>
            <p className="text-md">
              <strong>Address:</strong> {cart.shippingAddress?.address}, {cart.shippingAddress?.city},{' '}
              {cart.shippingAddress?.postalCode}, {cart.shippingAddress?.country}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold">Payment Method</h2>
            <p className="text-md">
              <strong>Method:</strong> {(cart.paymentMethod || 'paypal').toUpperCase()}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold">Order Items</h2>
            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty.</Message>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.cartItems.map((item, idx) => (
                  <div key={idx} className="flex w-full items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="mr-4 h-[60px] w-[60px] rounded object-cover"
                      />
                      <Link
                        to={`/products/${item.product}`}
                        className="font-bold text-lg text-gray-900 hover:text-primary-500"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <p className="text-md font-semibold">
                      {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span className="text-md">Items</span>
              <span className="font-bold">₹{itemsPrice}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <span className="text-md">Shipping</span>
              <span className="font-bold">₹{shippingPrice}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <span className="text-md">Tax</span>
              <span className="font-bold">₹{taxPrice}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-extrabold">₹{totalPrice}</span>
            </div>
          </div>

          {createError && <Message type="error" className="mt-4">{createError}</Message>}

          <button
            type="button"
            onClick={placeOrderHandler}
            disabled={cart.cartItems.length === 0 || createLoading}
            className="mt-8 w-full rounded bg-primary-500 py-3 text-lg font-medium text-white hover:bg-primary-600 disabled:opacity-50"
          >
            {createLoading ? 'Placing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
