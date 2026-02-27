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
      <section className="px-3 py-10 text-center text-slate-800 sm:py-14 md:py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 sm:gap-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Welcome to CartBuddy
          </h1>
          <p className="max-w-xl text-sm text-slate-600 sm:text-base md:text-lg">
            Discover the best products at unbeatable prices. Shop now and enjoy our offers!
          </p>
          <button
            type="button"
            onClick={() => navigate('/cart')}
            className="rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600 sm:px-6 sm:py-3 sm:text-base"
          >
            Shop Now
          </button>
        </div>
      </section>

      <section className="px-3 py-6 sm:py-8 md:px-4 md:py-10">
        <h2 className="mb-6 text-center text-xl font-bold text-slate-800 sm:mb-8 sm:text-2xl md:text-3xl">
          Latest Products
        </h2>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message type="error">{error}</Message>
        ) : (
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 xs:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12 rounded-xl border border-slate-200 bg-slate-100/80 px-4 py-10 text-center sm:mt-16 sm:py-14">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl md:text-3xl">
            Special Offer: 20% Off Your First Purchase
          </h2>
          <p className="max-w-xl text-sm text-slate-600 sm:text-base md:text-lg">
            Sign up now for an instant discount. Start your shopping with amazing savings!
          </p>
        </div>
      </section>
    </>
  );
}
