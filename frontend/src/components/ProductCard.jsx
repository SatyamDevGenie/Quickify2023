import { Link } from 'react-router-dom';
import Rating from './Rating';

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product._id}`} className="block no-underline">
      <div className="overflow-hidden rounded-lg bg-white shadow transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
        <img
          src={product.image}
          alt={product.name}
          className="h-[350px] w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="flex h-[150px] flex-col justify-between px-5 py-4">
          <h4 className="mb-3 truncate text-center font-bold text-gray-700 font-serif text-lg">
            {product.name}
          </h4>
          <div className="flex items-center justify-between">
            <Rating value={product.rating} />
            <span className="text-xl font-semibold text-blue-600">₹{product.price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
