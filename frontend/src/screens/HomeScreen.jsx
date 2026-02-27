import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts } from '../store/slices/productsSlice';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Message from '../components/Message';
import HeroCanvas from '../components/HeroCanvas';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, list: products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <>
      <section className="relative px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col items-start gap-5 text-left sm:gap-6">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-3xl font-extrabold tracking-tight text-slate-800 sm:text-4xl md:text-5xl lg:text-[3.2rem]"
            >
              Elevate Your{' '}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Shopping
              </span>{' '}
              Experience
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
              className="max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base md:text-lg"
            >
              Curated products, smooth checkout, and a cinematic interface powered by 3D visuals.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
              className="mt-1 flex flex-wrap gap-3"
            >
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="rounded-full bg-primary-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-primary-600 sm:px-7 sm:py-3 sm:text-base"
              >
                Shop Now
              </button>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:px-6 sm:py-3 sm:text-base"
              >
                Explore Products
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="relative h-[260px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-lg sm:h-[320px] md:h-[360px] md:rounded-3xl"
          >
            <HeroCanvas />
          </motion.div>
        </div>
      </section>

      <section className="px-3 py-6 sm:py-8 md:px-4 md:py-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-6 text-center text-xl font-bold text-slate-800 sm:mb-8 sm:text-2xl md:text-3xl"
        >
          Latest Products
        </motion.h2>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message type="error">{error}</Message>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mx-auto grid max-w-6xl grid-cols-1 gap-4 xs:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        )}
      </section>

      <section className="mt-12 rounded-xl border border-slate-200 bg-slate-100/80 px-4 py-10 text-center sm:mt-16 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto flex max-w-2xl flex-col items-center gap-4"
        >
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl md:text-3xl">
            Special Offer: 20% Off Your First Purchase
          </h2>
          <p className="max-w-xl text-sm text-slate-600 sm:text-base md:text-lg">
            Sign up now for an instant discount. Start your shopping with amazing savings!
          </p>
        </motion.div>
      </section>
    </>
  );
}
