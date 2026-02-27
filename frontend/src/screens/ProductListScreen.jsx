import { useEffect, useState } from 'react';
import { IoAdd, IoPencilSharp, IoSearch, IoTrashBinSharp } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  fetchProducts,
  createProduct,
  deleteProduct,
  clearCreateSuccess,
} from '../store/slices/productsSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function ProductListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { list: products, loading, error } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);
  const {
    deleteLoading: loadingDelete,
    deleteError: errorDelete,
    createLoading: loadingCreate,
    createError: errorCreate,
    createSuccess: successCreate,
    lastCreatedProduct,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(clearCreateSuccess());
    if (!userInfo?.isAdmin) navigate('/login');
    if (successCreate && lastCreatedProduct) {
      toast.success('Product created. You can edit it now.');
      navigate(`/admin/product/${lastCreatedProduct._id}/edit`);
    } else {
      dispatch(fetchProducts());
    }
  }, [dispatch, navigate, userInfo, successCreate, lastCreatedProduct]);

  useEffect(() => {
    if (errorDelete) toast.error(errorDelete);
  }, [errorDelete]);

  useEffect(() => {
    if (errorCreate) toast.error(errorCreate);
  }, [errorCreate]);

  const deleteHandler = (id) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const confirmDeleteHandler = () => {
    if (deleteId) {
      dispatch(deleteProduct(deleteId));
      toast.success('Product deleted.');
    }
    setModalOpen(false);
    setDeleteId(null);
  };

  const createProductHandler = () => {
    dispatch(createProduct());
    toast.info('Creating new product...');
  };

  const filteredProducts = (products || []).filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 sm:mb-6 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">Products</h1>
        <button
          type="button"
          onClick={createProductHandler}
          disabled={loadingCreate}
          className="inline-flex w-full items-center justify-center rounded-lg bg-primary-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50 sm:w-auto md:px-6 md:py-3"
        >
          <IoAdd className="mr-2 h-5 w-5" />
          Create Product
        </button>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-slate-300 py-2 pl-3 pr-10 text-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-base"
        />
        <IoSearch className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
      </div>

      {loadingDelete && <Loader />}
      {errorDelete && <Message type="error">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message type="error">{errorCreate}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : (
        <div className="mx-2 mt-4 rounded-lg bg-white px-2 py-5 shadow-lg md:mx-5 md:px-5">
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">NAME</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">PRICE</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">CATEGORY</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">BRAND</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-2 text-sm">{product._id}</td>
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">₹{Number(product.price).toFixed(2)}</td>
                    <td className="px-4 py-2">{product.category}</td>
                    <td className="px-4 py-2">{product.brand}</td>
                    <td className="flex gap-2 px-4 py-2">
                      <Link
                        to={`/admin/product/${product._id}/edit`}
                        className="inline-flex items-center rounded border border-primary-500 px-3 py-1 text-sm text-primary-500 hover:bg-primary-50"
                      >
                        <IoPencilSharp className="mr-1 h-4 w-4" />
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteHandler(product._id)}
                        className="inline-flex items-center rounded border border-red-500 px-3 py-1 text-sm text-red-500 hover:bg-red-50"
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
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-start justify-between">
                  <span className="text-sm font-bold text-gray-600">ID: {product._id}</span>
                  <div className="flex flex-col gap-2">
                    <Link
                      to={`/admin/product/${product._id}/edit`}
                      className="inline-flex items-center rounded border border-primary-500 px-2 py-1 text-sm text-primary-500"
                    >
                      <IoPencilSharp className="mr-1 h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteHandler(product._id)}
                      className="inline-flex items-center rounded border border-red-500 px-2 py-1 text-sm text-red-500"
                    >
                      <IoTrashBinSharp className="mr-1 h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
                <p className="font-medium text-gray-700">{product.name}</p>
                <p className="text-sm text-gray-600">Price: ₹{Number(product.price).toFixed(2)}</p>
                <p className="text-sm text-gray-600">Category: {product.category}</p>
                <p className="text-sm text-gray-600">Brand: {product.brand}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
            <h3 className="mb-2 text-lg font-bold text-slate-800">Confirm Delete</h3>
            <p className="mb-4 text-sm text-slate-600">Are you sure you want to delete this product? This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={confirmDeleteHandler}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => { setModalOpen(false); setDeleteId(null); }}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
