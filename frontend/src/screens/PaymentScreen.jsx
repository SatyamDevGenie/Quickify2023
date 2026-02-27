import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../store/slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import FormContainer from '../components/FormContainer';

export default function PaymentScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingAddress, paymentMethod } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [paymentMethodRadio, setPaymentMethodRadio] = useState(paymentMethod || 'paypal');

  useEffect(() => {
    if (!userInfo) navigate('/login');
    if (!shippingAddress?.address) navigate('/shipping');
  }, [navigate, shippingAddress, userInfo]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethodRadio));
    navigate('/placeorder');
  };

  return (
    <div className="flex w-full flex-col items-center justify-center bg-gray-50 py-10">
      <FormContainer className="w-full max-w-lg">
        <div className="w-full rounded-lg bg-white p-8 shadow-lg">
          <CheckoutSteps step1 step2 step3 />
          <h2 className="mb-6 text-center text-2xl font-bold">Make your Payment</h2>

          <form onSubmit={submitHandler}>
            <div className="flex flex-col gap-6">
              <fieldset>
                <legend className="text-lg font-semibold">Choose your payment method</legend>
                <div className="mt-4 flex flex-col gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethodRadio === 'paypal'}
                      onChange={(e) => setPaymentMethodRadio(e.target.value)}
                      className="h-4 w-4"
                    />
                    <span className="text-lg">PayPal or Credit/Debit Card</span>
                  </label>
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={!paymentMethodRadio}
                className="mt-4 w-full rounded bg-primary-500 py-3 text-lg font-medium text-white hover:bg-primary-600 disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            By proceeding, you agree to our <strong>Terms & Conditions</strong>.
          </p>
        </div>
      </FormContainer>
    </div>
  );
}
