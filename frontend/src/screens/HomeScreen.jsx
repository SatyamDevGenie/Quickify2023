import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productsSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, list: products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <>
      <section className="py-16 text-center text-black md:py-24">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
          <h1 className="text-2xl font-bold md:text-4xl lg:text-5xl">
            Welcome to Our Store
          </h1>
          <p className="text-base md:text-lg">
            Discover the best products at unbeatable prices. Shop now and enjoy our offers!
          </p>
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="rounded-lg bg-primary-500 px-6 py-3 text-lg font-medium text-white transition hover:bg-primary-600"
          >
            Shop Now
          </button>
        </div>
      </section>

      <section className="p-6 md:p-10">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
          Our Latest Products
        </h2>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message type="error">{error}</Message>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-20 bg-gray-100 py-16 px-6 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
          <h2 className="text-2xl font-bold md:text-3xl">
            Special Offer: 20% Off on Your First Purchase!
          </h2>
          <p className="max-w-2xl text-lg">
            Sign up now and get an instant discount code. Start your shopping journey with amazing savings!
          </p>
        </div>
      </section>
    </>
  );
}
