import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  HiOutlineMenuAlt3,
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineClipboardList,
  HiOutlineLogout,
} from 'react-icons/hi';
import { IoChevronDown } from 'react-icons/io5';
import { FiPackage, FiUsers } from 'react-icons/fi';
import { logout } from '../store/slices/authSlice';
import { clearOrderDetails } from '../store/slices/ordersSlice';
import { clearUsersList, clearSelectedUser } from '../store/slices/usersSlice';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const userRef = useRef(null);
  const adminRef = useRef(null);
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const cartCount = cartItems?.reduce((acc, item) => acc + item.qty, 0) || 0;

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

  const closeMobileMenu = () => setShow(false);

  return (
    <header className="fixed left-0 top-0 z-[99999] w-full border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex shrink-0 items-center gap-2 no-underline"
        >
          <span className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            CartBuddy
          </span>
          <span className="hidden rounded bg-primary-500 px-1.5 py-0.5 text-xs font-semibold text-white sm:inline">
            Shop
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <HiOutlineShoppingCart className="h-5 w-5" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-500 px-1.5 text-xs font-semibold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {userInfo ? (
            <div className="relative flex items-center gap-1" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <HiOutlineUser className="h-5 w-5" />
                <span className="max-w-[120px] truncate">{userInfo.name}</span>
                <IoChevronDown className={`h-4 w-4 shrink-0 transition ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                  <div className="border-b border-slate-100 px-4 py-2">
                    <p className="truncate text-sm font-medium text-slate-900">{userInfo.name}</p>
                    <p className="truncate text-xs text-slate-500">{userInfo.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <HiOutlineCog className="h-4 w-4 text-slate-400" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setUserMenuOpen(false); logoutHandler(); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <HiOutlineLogout className="h-4 w-4 text-slate-400" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <HiOutlineUser className="h-5 w-5" />
              Log in
            </Link>
          )}

          {userInfo?.isAdmin && (
            <div className="relative ml-1 border-l border-slate-200 pl-2" ref={adminRef}>
              <button
                type="button"
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                className="flex items-center gap-2 rounded-lg bg-primary-50 px-4 py-2.5 text-sm font-medium text-primary-700 transition hover:bg-primary-100"
              >
                <HiOutlineClipboardList className="h-5 w-5" />
                Admin
                <IoChevronDown className={`h-4 w-4 shrink-0 transition ${adminMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {adminMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                  <Link
                    to="/admin/userlist"
                    onClick={() => setAdminMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <FiUsers className="h-4 w-4 text-slate-400" />
                    Users
                  </Link>
                  <Link
                    to="/admin/productlist"
                    onClick={() => setAdminMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <FiPackage className="h-4 w-4 text-slate-400" />
                    Products
                  </Link>
                  <Link
                    to="/admin/orderList"
                    onClick={() => setAdminMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <HiOutlineClipboardList className="h-4 w-4 text-slate-400" />
                    Orders
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 md:hidden"
          onClick={() => setShow(!show)}
          aria-label="Toggle menu"
        >
          <HiOutlineMenuAlt3 className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile nav */}
      {show && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg md:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <HiOutlineShoppingCart className="h-5 w-5 text-slate-500" />
              Cart
              {cartCount > 0 && (
                <span className="ml-auto rounded-full bg-primary-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {userInfo ? (
              <>
                <div className="my-2 border-t border-slate-100 pt-2">
                  <p className="truncate px-4 text-xs font-medium text-slate-500">{userInfo.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <HiOutlineCog className="h-5 w-5 text-slate-500" />
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => { closeMobileMenu(); logoutHandler(); }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <HiOutlineLogout className="h-5 w-5 text-slate-500" />
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <HiOutlineUser className="h-5 w-5 text-slate-500" />
                Log in
              </Link>
            )}

            {userInfo?.isAdmin && (
              <>
                <div className="my-2 border-t border-slate-100 pt-2">
                  <p className="px-4 text-xs font-semibold uppercase tracking-wide text-primary-600">Admin</p>
                </div>
                <Link
                  to="/admin/userlist"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <FiUsers className="h-5 w-5 text-slate-500" />
                  Users
                </Link>
                <Link
                  to="/admin/productlist"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <FiPackage className="h-5 w-5 text-slate-500" />
                  Products
                </Link>
                <Link
                  to="/admin/orderList"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <HiOutlineClipboardList className="h-5 w-5 text-slate-500" />
                  Orders
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
