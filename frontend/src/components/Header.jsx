import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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
    navigate('/login');
  };

  return (
    <header className="fixed left-0 top-0 z-[99999] flex w-full flex-wrap items-center justify-between bg-black px-6 py-6">
      <Link to="/" className="font-black text-white/90 tracking-wide text-[1.8rem] no-underline">
        CartBuddy
      </Link>

      <button
        type="button"
        className="block md:hidden"
        onClick={() => setShow(!show)}
        aria-label="Menu"
      >
        <HiOutlineMenuAlt3 className="h-6 w-6 text-white" />
      </button>

      <nav
        className={`flex flex-wrap items-center gap-2 md:gap-4 ${show ? 'block w-full' : 'hidden w-full'} mt-4 md:mt-0 md:flex md:w-auto`}
      >
        <HeaderMenuItem icon={HiShoppingBag} label="Cart" url="/cart" />

        {userInfo ? (
          <div className="relative" ref={userRef}>
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="inline-flex items-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {userInfo.name}
              <IoChevronDown className="ml-1 h-4 w-4" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => { setUserMenuOpen(false); logoutHandler(); }}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
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
              className="inline-flex items-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Manage
              <IoChevronDown className="ml-1 h-4 w-4" />
            </button>
            {adminMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                <Link
                  to="/admin/userlist"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setAdminMenuOpen(false)}
                >
                  All Users
                </Link>
                <Link
                  to="/admin/productlist"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setAdminMenuOpen(false)}
                >
                  All Products
                </Link>
                <Link
                  to="/admin/orderlist"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
