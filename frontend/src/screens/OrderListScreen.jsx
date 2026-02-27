import { useEffect } from 'react';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAllOrders } from '../store/slices/ordersSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function OrderListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allOrders: orders, allOrdersLoading: loading, allOrdersError: error } = useSelector((state) => state.orders);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo?.isAdmin) {
      dispatch(fetchAllOrders());
    } else {
      navigate('/login');
    }
  }, [dispatch, userInfo, navigate]);

  return (
    <>
      <div className="mb-6 flex items-center justify-center">
        <HiOutlineClipboardList className="mr-3 h-8 w-8 text-primary-500" />
        <h1 className="text-center text-2xl font-bold md:text-3xl">Order Management</h1>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : !orders?.length ? (
        <Message type="info">No orders placed yet.</Message>
      ) : (
        <div className="mx-2 rounded-lg bg-gray-100 p-2 md:mx-10 md:p-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-md border border-gray-200 bg-white p-5 shadow-md transition-all hover:shadow-xl"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-800">
                      Order #{order._id?.substring(0, 8)}...
                    </span>
                    <Link
                      to={`/order/${order._id}`}
                      className="rounded bg-primary-500 px-3 py-1 text-sm text-white hover:bg-primary-600"
                    >
                      View Details
                    </Link>
                  </div>
                  <p className="text-sm">
                    <strong>User:</strong> {order.user?.name}
                  </p>
                  <p className="text-sm">
                    <strong>Date:</strong> {order.createdAt?.substring(0, 10)}
                  </p>
                  <p className="text-sm">
                    <strong>Total:</strong> ₹{Number(order.totalPrice).toFixed(2)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-sm font-medium ${
                        order.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.isPaid ? `Paid: ${order.paidAt?.substring(0, 10)}` : 'Not Paid'}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-sm font-medium ${
                        order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.isDelivered ? `Delivered: ${order.deliveredAt?.substring(0, 10)}` : 'Not Delivered'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
