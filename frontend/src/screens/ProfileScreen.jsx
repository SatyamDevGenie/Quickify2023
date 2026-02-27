import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
    if (updateProfileSuccess) {
      toast.success('Profile updated successfully.');
      dispatch(clearProfileSuccess());
    }
  }, [updateProfileSuccess, dispatch]);

  useEffect(() => {
    if (profileError) toast.error(profileError);
  }, [profileError]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setMessage('Passwords do not match');
      toast.error('Passwords do not match');
    } else {
      setMessage('');
      dispatch(updateProfile({ name, email, password: password || undefined }));
    }
  };

  return (
    <div className="mx-auto max-w-6xl grid grid-cols-1 gap-6 px-3 py-4 sm:py-6 md:grid-cols-2 md:gap-8 md:px-4">
      <div className="w-full">
        <FormContainer className="w-full">
          <h1 className="mb-6 text-2xl font-bold text-slate-800 sm:mb-8 sm:text-3xl">Profile</h1>

          {profileError && <Message type="error">{profileError}</Message>}
          {message && <Message type="error">{message}</Message>}

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">New Password (leave blank to keep)</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-base"
              />
            </div>
            <button
              type="submit"
              disabled={profileLoading}
              className="w-full rounded-lg bg-primary-500 py-3 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50 sm:text-base"
            >
              {profileLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </FormContainer>
      </div>

      <div className="w-full overflow-x-auto">
        <h2 className="mb-4 text-xl font-bold text-slate-800 sm:text-2xl">My Orders</h2>

        {myOrdersLoading ? (
          <Loader />
        ) : myOrdersError ? (
          <Message type="error">{myOrdersError}</Message>
        ) : !myOrders?.length ? (
          <Message type="info">You have no orders yet.</Message>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2.5 font-medium text-slate-600 sm:px-4">ID</th>
                  <th className="px-3 py-2.5 font-medium text-slate-600 sm:px-4">Date</th>
                  <th className="px-3 py-2.5 font-medium text-slate-600 sm:px-4">Total</th>
                  <th className="px-3 py-2.5 font-medium text-slate-600 sm:px-4">Paid</th>
                  <th className="px-3 py-2.5 font-medium text-slate-600 sm:px-4">Delivered</th>
                  <th className="px-3 py-2.5 sm:px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {(myOrders || []).map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50">
                    <td className="max-w-[80px] truncate px-3 py-2.5 text-slate-600 sm:max-w-[120px] sm:px-4">{order._id}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 sm:px-4">{new Date(order.createdAt).toDateString()}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 font-medium sm:px-4">₹{order.totalPrice}</td>
                    <td className="px-3 py-2.5 sm:px-4">
                      {order.isPaid ? new Date(order.paidAt).toDateString() : <IoWarning className="inline h-5 w-5 text-amber-500" />}
                    </td>
                    <td className="px-3 py-2.5 sm:px-4">
                      {order.isDelivered ? new Date(order.deliveredAt).toDateString() : <IoWarning className="inline h-5 w-5 text-amber-500" />}
                    </td>
                    <td className="px-3 py-2.5 sm:px-4">
                      <Link
                        to={`/order/${order._id}`}
                        className="inline-block rounded-lg bg-primary-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-primary-600"
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
