import { useEffect } from 'react';
import { IoPencilSharp, IoTrashBinSharp } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteUser, fetchUsers } from '../store/slices/usersSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function UserListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: users, loading, error } = useSelector((state) => state.users);
  const { userInfo } = useSelector((state) => state.auth);
  const { deleteSuccess } = useSelector((state) => state.users);

  useEffect(() => {
    if (userInfo?.isAdmin) {
      dispatch(fetchUsers());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate, userInfo, deleteSuccess]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      dispatch(deleteUser(id));
      toast.success('User deleted.');
    }
  };

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-slate-800 md:text-3xl">User Management</h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : (
        <div className="rounded-lg bg-white p-4 shadow-md md:p-6">
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">NAME</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">EMAIL</th>
                  <th className="text-center text-sm font-medium text-gray-700">ROLE</th>
                  <th className="text-center text-sm font-medium text-gray-700">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {(users || []).map((user) => (
                  <tr key={user._id} className="border-t border-gray-200">
                    <td className="px-4 py-2 text-sm text-gray-600">{user._id}</td>
                    <td className="px-4 py-2 font-medium text-gray-700">{user.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      <a href={`mailto:${user.email}`} className="text-primary-600 hover:underline">{user.email}</a>
                    </td>
                    <td className="text-center">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                          user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="flex justify-center gap-3 px-4 py-2">
                      <Link
                        to={`/admin/user/${user._id}/edit`}
                        className="inline-flex items-center rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                      >
                        <IoPencilSharp className="mr-1 h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteHandler(user._id)}
                        className="inline-flex items-center rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
                      >
                        <IoTrashBinSharp className="mr-1 h-4 w-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 md:hidden">
            {(users || []).map((user) => (
              <div
                key={user._id}
                className="rounded-md border border-gray-200 bg-gray-50 p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{user._id}</span>
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/user/${user._id}/edit`}
                      className="rounded border border-blue-500 p-1 text-blue-500"
                    >
                      <IoPencilSharp className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteHandler(user._id)}
                      className="rounded border border-red-500 p-1 text-red-500"
                    >
                      <IoTrashBinSharp className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <hr className="mb-3 border-gray-200" />
                <p className="font-bold text-gray-700">{user.name}</p>
                <p className="text-sm text-gray-600">
                  <a href={`mailto:${user.email}`} className="text-primary-600">{user.email}</a>
                </p>
                <span
                  className={`mt-2 inline-block rounded px-2 py-0.5 text-sm ${
                    user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.isAdmin ? 'Admin' : 'User'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
