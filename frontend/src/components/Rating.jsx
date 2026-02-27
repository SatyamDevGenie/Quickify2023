import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';

export default function Rating({ value, text, color = 'text-amber-500' }) {
  const Star = ({ filled }) => {
    if (filled === 1) return <IoStar className={`inline ${color}`} />;
    if (filled === 0.5) return <IoStarHalf className={`inline ${color}`} />;
    return <IoStarOutline className={`inline ${color}`} />;
  };
  return (
    <div className="flex items-center gap-0.5">
      <span className="flex">
        <Star filled={value >= 1 ? 1 : value >= 0.5 ? 0.5 : 0} />
        <Star filled={value >= 2 ? 1 : value >= 1.5 ? 0.5 : 0} />
        <Star filled={value >= 3 ? 1 : value >= 2.5 ? 0.5 : 0} />
        <Star filled={value >= 4 ? 1 : value >= 3.5 ? 0.5 : 0} />
        <Star filled={value >= 5 ? 1 : value >= 4.5 ? 0.5 : 0} />
      </span>
      {text && <span className="ml-1 text-sm text-gray-600">{text}</span>}
    </div>
  );
}
