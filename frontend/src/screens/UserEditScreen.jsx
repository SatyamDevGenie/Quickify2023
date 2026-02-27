import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchUserById, updateUser, clearUpdateSuccess } from '../store/slices/usersSlice';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function UserEditScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const { selectedUser: user, selectedUserLoading: loading, selectedUserError: error } = useSelector((state) => state.users);
  const { updateLoading: loadingUpdate, updateError: errorUpdate, updateSuccess: successUpdate } = useSelector((state) => state.users);

  useEffect(() => {
    if (errorUpdate) toast.error(errorUpdate);
  }, [errorUpdate]);

  useEffect(() => {
    if (successUpdate) {
      toast.success('User updated successfully.');
      dispatch(clearUpdateSuccess());
      navigate('/admin/userlist');
    } else {
      if (!user?.name || user._id !== userId) {
        dispatch(fetchUserById(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(!!user.isAdmin);
      }
    }
  }, [dispatch, userId, user, successUpdate, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  return (
    <div className="mx-auto max-w-xl px-3 py-4 sm:py-6">
      <Link
        to="/admin/userlist"
        className="mb-4 inline-block text-sm font-medium text-primary-600 hover:underline"
      >
        ← Back to users
      </Link>

      <div className="w-full py-4">
        <FormContainer className="w-full max-w-[500px] mx-auto">
          <h1 className="mb-6 text-center text-2xl font-bold text-slate-800 sm:mb-8 md:text-3xl">Edit User</h1>

            {loadingUpdate && <Loader />}
            {errorUpdate && <Message type="error">{errorUpdate}</Message>}

            {loading ? (
              <Loader />
            ) : error ? (
              <Message type="error">{error}</Message>
            ) : (
              <form onSubmit={submitHandler}>
                <div className="flex flex-col gap-5">
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="isAdmin"
                      type="checkbox"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <label htmlFor="isAdmin" className="text-sm font-medium text-gray-700">Is Admin?</label>
                  </div>
                  <button
                    type="submit"
                    disabled={loadingUpdate}
                    className="w-full rounded bg-primary-500 py-2 text-white hover:bg-primary-600 disabled:opacity-50"
                  >
                    {loadingUpdate ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            )}
        </FormContainer>
      </div>
    </div>
  );
}
