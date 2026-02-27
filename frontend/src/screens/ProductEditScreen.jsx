import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { fetchProductById, updateProduct, clearUpdateSuccess } from '../store/slices/productsSlice';
import api from '../lib/api';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function ProductEditScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [uploading, setUploading] = useState(false);

  const { selectedProduct: product, productLoading: loading, productError: error } = useSelector((state) => state.products);
  const { updateLoading: loadingUpdate, updateError: errorUpdate, updateSuccess: successUpdate } = useSelector((state) => state.products);

  useEffect(() => {
    if (successUpdate) {
      dispatch(clearUpdateSuccess());
      navigate('/admin/productlist');
    } else {
      if (!product?.name || product._id !== productId) {
        dispatch(fetchProductById(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image || '');
        setBrand(product.brand || '');
        setCategory(product.category || '');
        setCountInStock(product.countInStock ?? 0);
        setDescription(product.description || '');
      }
    }
  }, [dispatch, navigate, productId, product, successUpdate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price: Number(price),
        image,
        brand,
        category,
        description,
        countInStock: Number(countInStock),
      })
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const { data } = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImage(data?.url || data?.secure_url || data);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="px-8 py-4">
        <Link
          to="/admin/productlist"
          className="mb-5 inline-flex items-center justify-center rounded bg-primary-500 p-2 text-white hover:bg-primary-600"
          aria-label="Go Back"
        >
          <FaArrowLeft className="h-5 w-5" />
        </Link>

        <div className="flex w-full items-center justify-center py-5">
          <FormContainer className="w-full max-w-lg">
            <h1 className="mb-8 text-3xl font-bold">Edit Product</h1>

            {loadingUpdate && <Loader />}
            {errorUpdate && <Message type="error">{errorUpdate}</Message>}

            {loading ? (
              <Loader />
            ) : error ? (
              <Message type="error">{error}</Message>
            ) : (
              <form onSubmit={submitHandler}>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      placeholder="Enter price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Image</label>
                    <input
                      type="text"
                      placeholder="Enter image URL"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <input
                      type="file"
                      onChange={uploadFileHandler}
                      className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
                    {image && (
                      <img src={image} alt="Preview" className="mt-2 h-[150px] w-[150px] rounded object-cover" />
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                    <input
                      type="text"
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Brand</label>
                    <input
                      type="text"
                      placeholder="Enter brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      placeholder="Enter category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Count In Stock</label>
                    <input
                      type="number"
                      placeholder="Product in stock"
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                      className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loadingUpdate}
                    className="mt-4 w-full rounded bg-primary-500 py-3 text-white hover:bg-primary-600 disabled:opacity-50"
                  >
                    {loadingUpdate ? 'Updating...' : 'Update Product'}
                  </button>
                </div>
              </form>
            )}
          </FormContainer>
        </div>
      </div>
    </>
  );
}
