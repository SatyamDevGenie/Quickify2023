import { Link } from 'react-router-dom';

export default function HeaderMenuItem({ label, url, icon: Icon }) {
  return (
    <Link
      to={url}
      className="mr-5 flex items-center text-sm font-bold uppercase tracking-wide text-white/80 transition hover:text-white hover:no-underline"
    >
      {Icon && <Icon className="mr-1 h-4 w-4" />}
      {label}
    </Link>
  );
}
