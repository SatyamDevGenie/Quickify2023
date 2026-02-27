import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { saveShippingAddress } from '../store/slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { countries } from '../data/countries';
import FormContainer from '../components/FormContainer';

export default function ShippingScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingAddress } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  useEffect(() => {
    if (!userInfo) navigate('/login');
  }, [navigate, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    toast.success('Shipping address saved.');
    navigate('/payment');
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center px-3 py-6 sm:py-10">
      <FormContainer className="w-full max-w-md">
        <h2 className="mb-4 text-center text-2xl font-bold text-slate-800 sm:mb-6 sm:text-3xl">Shipping Address</h2>
        <div className="mb-6 flex w-full justify-center sm:mb-8">
          <CheckoutSteps step1 step2 />
        </div>
        <hr className="mb-6 border-slate-200 sm:mb-8" />

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label htmlFor="address" className="mb-1 block text-sm font-medium text-slate-700">Address</label>
            <input
              id="address"
              type="text"
              placeholder="Street address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="city" className="mb-1 block text-sm font-medium text-slate-700">City</label>
            <input
              id="city"
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="postalCode" className="mb-1 block text-sm font-medium text-slate-700">Postal Code</label>
            <input
              id="postalCode"
              type="text"
              placeholder="Postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="country" className="mb-1 block text-sm font-medium text-slate-700">Country</label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:text-base"
              required
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={!address || !city || !postalCode || !country}
            className="mt-2 w-full rounded-lg bg-primary-500 py-3 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50 sm:text-base"
          >
            Continue to Payment
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500 sm:text-sm">
          By continuing you agree to our Terms & Conditions.
        </p>
      </FormContainer>
    </div>
  );
}
