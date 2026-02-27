import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { IoWarning } from 'react-icons/io5';
import { getProfile, updateProfile, clearProfileSuccess } from '../store/slices/authSlice';
import { fetchMyOrders } from '../store/slices/ordersSlice';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const { userInfo, profile, profileLoading, profileError, updateProfileSuccess } = useSelector((state) => state.auth);
  const { myOrders, myOrdersLoading, myOrdersError } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(getProfile());
      dispatch(fetchMyOrders());
    }
  }, [dispatch, navigate, userInfo]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
    }
  }, [profile]);

  useEffect(() => {
    if (updateProfileSuccess) dispatch(clearProfileSuccess());
  }, [updateProfileSuccess, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(updateProfile({ name, email, password: password || undefined }));
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 py-5 px-2 md:grid-cols-2 md:gap-10 md:px-6">
      <div className="flex w-full items-center justify-center py-5">
        <FormContainer className="w-full">
          <h1 className="mb-8 text-2xl font-bold md:text-3xl">User Profile</h1>

          {profileError && <Message type="error">{profileError}</Message>}
          {message && <Message type="error">{message}</Message>}

          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Your Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="username@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                placeholder="************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="************"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={profileLoading}
              className="mt-2 w-full rounded bg-primary-500 py-2 text-white hover:bg-primary-600 disabled:opacity-50"
            >
              {profileLoading ? 'Updating...' : 'Update'}
            </button>
          </form>
        </FormContainer>
      </div>

      <div className="overflow-x-auto">
        <h2 className="mb-4 text-xl font-bold md:text-2xl">My Orders</h2>

        {myOrdersLoading ? (
          <Loader />
        ) : myOrdersError ? (
          <Message type="error">{myOrdersError}</Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-600">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-600">DATE</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-600">TOTAL</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-600">PAID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-600">DELIVERED</th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase text-gray-600"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {(myOrders || []).map((order) => (
                  <tr key={order._id}>
                    <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-600">{order._id}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm">{new Date(order.createdAt).toDateString()}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm">₹{order.totalPrice}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm">
                      {order.isPaid ? new Date(order.paidAt).toDateString() : <IoWarning className="inline h-5 w-5 text-red-400" />}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-sm">
                      {order.isDelivered ? new Date(order.deliveredAt).toDateString() : <IoWarning className="inline h-5 w-5 text-red-400" />}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <Link
                        to={`/order/${order._id}`}
                        className="rounded bg-primary-500 px-3 py-1 text-sm text-white hover:bg-primary-600"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
