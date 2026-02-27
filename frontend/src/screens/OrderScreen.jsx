import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  deliverOrder,
  fetchOrderById,
  payOrder,
  clearPaySuccess,
  clearDeliverSuccess,
} from '../store/slices/ordersSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'Ade_MnCXzZUYnWLhn_nlQ_d5eLyuuvW3oPoml3KNcZO2FMFgeqywIOPT3HW3pywVo45_Hf_AEYDdHRkf';

export default function OrderScreen() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id: orderId } = useParams();
  const [showDeliveredMessage, setShowDeliveredMessage] = useState(false);

  const { orderDetails: order, orderLoading: loading, orderError: error, deliverSuccess } = useSelector((state) => state.orders);
  const { payLoading: loadingPay } = useSelector((state) => state.orders);
  const { deliverLoading: loadingDeliver } = useSelector((state) => state.orders);
  const { userInfo } = useSelector((state) => state.auth);

  const orderPlacedEmailSent = location.state?.orderPlaced === true;

  useEffect(() => {
    dispatch(clearPaySuccess());
    dispatch(clearDeliverSuccess());
    if (!order || order._id !== orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId, order?._id]);

  useEffect(() => {
    if (deliverSuccess && order?.isDelivered) {
      toast.success('Order marked as delivered. Customer has been notified.');
      setShowDeliveredMessage(true);
      dispatch(clearDeliverSuccess());
      const t = setTimeout(() => setShowDeliveredMessage(false), 6000);
      return () => clearTimeout(t);
    }
  }, [deliverSuccess, order?.isDelivered, dispatch]);

  const itemsPrice = order?.orderItems?.reduce((acc, item) => acc + item.price * item.qty, 0) ?? 0;

  const successPaymentHandler = (details) => {
    dispatch(payOrder({
      orderId,
      paymentResult: {
        id: details.id,
        state: details.status,
        update_time: details.update_time,
        email_address: details.payer?.email_address,
      },
    }));
    toast.success('Payment completed successfully.');
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  if (loading) return <Loader />;
  if (error) return <Message type="error">{error}</Message>;
  if (!order) return null;

  return (
    <div className="mx-auto max-w-6xl flex w-full flex-col px-3 py-6 sm:py-8 md:px-6">
      {orderPlacedEmailSent && (
        <Message type="success" className="mb-4">
          Order placed successfully! A confirmation email has been sent to your email.
        </Message>
      )}
      {showDeliveredMessage && userInfo?.isAdmin && (
        <Message type="success" className="mb-4">
          Order marked as delivered. A confirmation email has been sent to the customer.
        </Message>
      )}
      <div className="grid gap-6 md:grid-cols-[3fr_2fr] md:gap-8">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-3 text-lg font-bold text-slate-800 sm:text-xl">Shipping</h2>
            <p><strong>Name:</strong> {order.user?.name}</p>
            <p>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${order.user?.email}`} className="text-primary-500 hover:underline">
                {order.user?.email}
              </a>
            </p>
            <p className="mt-2">
              <strong>Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
              {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
            </p>
            <div className="mt-4">
              {order.isDelivered ? (
                <Message type="success">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</Message>
              ) : (
                <Message type="info">Not Delivered</Message>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-3 text-lg font-bold text-slate-800 sm:text-xl">Payment</h2>
            <p><strong>Method:</strong> {(order.paymentMethod || '').toUpperCase()}</p>
            <div className="mt-4">
              {order.isPaid ? (
                <Message type="success">Paid on {new Date(order.paidAt).toUTCString()}</Message>
              ) : (
                <Message type="info">Not Paid</Message>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-3 text-lg font-bold text-slate-800 sm:text-xl">Order Items</h2>
            {!order.orderItems?.length ? (
              <Message>No Order Info</Message>
            ) : (
              <div className="flex flex-col gap-4">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="mr-4 h-[50px] w-[50px] rounded object-cover"
                      />
                      <Link
                        to={`/products/${item.product}`}
                        className="font-bold text-lg text-primary-600 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <p className="font-medium">
                      {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-md sm:p-6 lg:sticky lg:top-24">
          <h2 className="mb-4 text-center text-xl font-bold text-slate-800">Order Summary</h2>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <span>Items</span>
              <span className="font-bold">₹{order.itemsPrice ?? itemsPrice}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold">₹{order.shippingPrice}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-bold">₹{order.taxPrice}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <span>Total</span>
              <span className="text-xl font-bold">₹{order.totalPrice}</span>
            </div>
          </div>

          {!order.isPaid && (
            <div className="mt-8">
              {loadingPay ? (
                <Loader />
              ) : (
                <PayPalScriptProvider
                  options={{
                    'client-id': PAYPAL_CLIENT_ID,
                    components: 'buttons',
                  }}
                >
                  <PayPalButtons
                    createOrder={(data, actions) =>
                      actions.order.create({
                        purchase_units: [{ amount: { value: String(order.totalPrice) } }],
                      })
                    }
                    onApprove={(data, actions) =>
                      actions.order.capture().then((details) => {
                        successPaymentHandler(details);
                      })
                    }
                  />
                </PayPalScriptProvider>
              )}
            </div>
          )}

          {loadingDeliver && <Loader />}
          {userInfo?.isAdmin && !order.isDelivered && (
            <button
              type="button"
              onClick={deliverHandler}
              disabled={loadingDeliver}
              className="mt-6 w-full rounded-lg bg-primary-500 py-3 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50 sm:text-base"
            >
              {loadingDeliver ? 'Updating...' : 'Mark as Delivered'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
