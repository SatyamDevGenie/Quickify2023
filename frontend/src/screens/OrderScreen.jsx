import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
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
  const { id: orderId } = useParams();

  const { orderDetails: order, orderLoading: loading, orderError: error } = useSelector((state) => state.orders);
  const { payLoading: loadingPay } = useSelector((state) => state.orders);
  const { deliverLoading: loadingDeliver } = useSelector((state) => state.orders);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearPaySuccess());
    dispatch(clearDeliverSuccess());
    if (!order || order._id !== orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId, order?._id]);

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
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  if (loading) return <Loader />;
  if (error) return <Message type="error">{error}</Message>;
  if (!order) return null;

  return (
    <div className="flex w-full flex-col py-8">
      <div className="grid gap-8 md:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold">Shipping</h2>
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

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold">Payment Method</h2>
            <p><strong>Method:</strong> {(order.paymentMethod || '').toUpperCase()}</p>
            <div className="mt-4">
              {order.isPaid ? (
                <Message type="success">Paid on {new Date(order.paidAt).toUTCString()}</Message>
              ) : (
                <Message type="info">Not Paid</Message>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold">Order Items</h2>
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

        <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-2xl font-bold">Order Summary</h2>

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
              className="mt-6 w-full rounded bg-primary-500 py-3 text-lg font-medium text-white hover:bg-primary-600"
            >
              Mark as Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
