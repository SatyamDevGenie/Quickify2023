import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HiOutlineMenuAlt3, HiShoppingBag, HiUser } from 'react-icons/hi';
import { IoChevronDown } from 'react-icons/io5';
import { logout } from '../store/slices/authSlice';
import { clearOrderDetails } from '../store/slices/ordersSlice';
import { clearUsersList, clearSelectedUser } from '../store/slices/usersSlice';
import HeaderMenuItem from './HeaderMenuItem';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const userRef = useRef(null);
  const adminRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
      if (adminRef.current && !adminRef.current.contains(e.target)) setAdminMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(clearOrderDetails());
    dispatch(clearUsersList());
    dispatch(clearSelectedUser());
    toast.info('You have been signed out.');
    navigate('/login');
  };

  return (
    <header className="fixed left-0 top-0 z-[99999] flex w-full flex-wrap items-center justify-between gap-3 bg-black px-4 py-3 shadow-lg sm:px-5 md:px-6 md:py-4">
      <Link
        to="/"
        className="text-lg font-bold tracking-tight text-white no-underline sm:text-xl md:text-2xl"
      >
        CartBuddy
      </Link>

      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10 md:hidden"
        onClick={() => setShow(!show)}
        aria-label="Toggle menu"
      >
        <HiOutlineMenuAlt3 className="h-6 w-6" />
      </button>

      <nav
        className={`flex w-full flex-col gap-2 rounded-lg bg-slate-800/50 p-3 md:mt-0 md:flex md:w-auto md:flex-row md:items-center md:gap-3 md:bg-transparent md:p-0 ${show ? 'flex' : 'hidden md:flex'}`}
      >
        <HeaderMenuItem icon={HiShoppingBag} label="Cart" url="/cart" />

        {userInfo ? (
          <div className="relative" ref={userRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex w-full items-center justify-between rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 md:w-auto md:min-w-[140px]"
            >
              <span className="truncate">{userInfo.name}</span>
              <IoChevronDown className="ml-1 h-4 w-4 shrink-0" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 left-0 mt-1 w-full min-w-[180px] rounded-lg border border-slate-600 bg-white py-1 shadow-xl md:left-auto md:w-48">
                <Link
                  to="/profile"
                  className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => { setUserMenuOpen(false); logoutHandler(); }}
                  className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <HeaderMenuItem icon={HiUser} label="Login" url="/login" />
        )}

        {userInfo?.isAdmin && (
          <div className="relative" ref={adminRef}>
            <button
              type="button"
              onClick={() => setAdminMenuOpen(!adminMenuOpen)}
              className="flex w-full items-center justify-between rounded-lg border border-primary-400/50 bg-primary-500/20 px-3 py-2 text-sm font-medium text-primary-100 transition hover:bg-primary-500/30 md:w-auto md:min-w-[120px]"
            >
              Manage
              <IoChevronDown className="ml-1 h-4 w-4 shrink-0" />
            </button>
            {adminMenuOpen && (
              <div className="absolute right-0 left-0 mt-1 w-full min-w-[180px] rounded-lg border border-slate-200 bg-white py-1 shadow-xl md:left-auto md:w-48">
                <Link
                  to="/admin/userlist"
                  className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                  onClick={() => setAdminMenuOpen(false)}
                >
                  All Users
                </Link>
                <Link
                  to="/admin/productlist"
                  className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                  onClick={() => setAdminMenuOpen(false)}
                >
                  All Products
                </Link>
                <Link
                  to="/admin/orderList"
                  className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100"
                  onClick={() => setAdminMenuOpen(false)}
                >
                  All Orders
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
