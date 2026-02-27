import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
    navigate('/payment');
  };

  return (
    <div className="flex w-full flex-col items-center justify-center bg-gray-50 py-10">
      <FormContainer className="w-full max-w-md">
        <h2 className="mb-6 text-center text-3xl font-bold">Shipping Address</h2>
        <div className="mb-8 flex w-full justify-center">
          <CheckoutSteps step1 step2 />
        </div>
        <hr className="mb-8 border-gray-200" />

        <form onSubmit={submitHandler}>
          <div className="flex max-w-md flex-col gap-6">
            <div>
              <label htmlFor="address" className="mb-1 block text-sm font-semibold">Address</label>
              <input
                id="address"
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="city" className="mb-1 block text-sm font-semibold">City</label>
              <input
                id="city"
                type="text"
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="mb-1 block text-sm font-semibold">Postal Code</label>
              <input
                id="postalCode"
                type="text"
                placeholder="Enter your postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="country" className="mb-1 block text-sm font-semibold">Country</label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Select your country"
                className="w-full rounded border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select your country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={!address || !city || !postalCode || !country}
              className="mt-4 w-full rounded bg-primary-500 py-3 text-lg font-medium text-white hover:bg-primary-600 disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          By proceeding, you agree to our <strong>Terms & Conditions</strong>.
        </p>
      </FormContainer>
    </div>
  );
}
