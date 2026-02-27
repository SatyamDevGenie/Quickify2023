import { Link } from 'react-router-dom';
import Rating from './Rating';

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product._id}`} className="block no-underline">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md focus-within:ring-2 focus-within:ring-primary-500/20">
        <div className="aspect-square w-full overflow-hidden bg-slate-100 sm:aspect-[4/5]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="flex min-h-[100px] flex-col justify-between px-4 py-3 sm:px-5 sm:py-4">
          <h4 className="mb-2 line-clamp-2 text-center text-sm font-semibold text-slate-800 sm:text-base">
            {product.name}
          </h4>
          <div className="flex items-center justify-between gap-2">
            <Rating value={product.rating} />
            <span className="text-base font-semibold text-primary-600 sm:text-lg">₹{product.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
