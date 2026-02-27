import { Link } from 'react-router-dom';

export default function HeaderMenuItem({ label, url, icon: Icon }) {
  return (
    <Link
      to={url}
      className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white md:rounded md:px-2 md:py-1"
    >
      {Icon && <Icon className="mr-2 h-5 w-5 shrink-0 md:mr-1 md:h-4 md:w-4" />}
      {label}
    </Link>
  );
}
