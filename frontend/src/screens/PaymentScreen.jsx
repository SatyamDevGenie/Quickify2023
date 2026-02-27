import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
    toast.success('Payment method saved.');
    navigate('/placeorder');
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center px-3 py-6 sm:py-10">
      <FormContainer className="w-full max-w-lg">
        <CheckoutSteps step1 step2 step3 />
        <h2 className="mb-6 text-center text-2xl font-bold text-slate-800 sm:text-3xl">Payment Method</h2>

        <form onSubmit={submitHandler} className="space-y-6">
          <fieldset className="rounded-lg border border-slate-200 p-4">
            <legend className="text-sm font-medium text-slate-700 sm:text-base">Choose payment method</legend>
            <div className="mt-3 flex flex-col gap-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50/50">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethodRadio === 'paypal'}
                  onChange={(e) => setPaymentMethodRadio(e.target.value)}
                  className="h-4 w-4 text-primary-500"
                />
                <span className="text-sm font-medium text-slate-700 sm:text-base">PayPal or Credit/Debit Card</span>
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            disabled={!paymentMethodRadio}
            className="w-full rounded-lg bg-primary-500 py-3 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50 sm:text-base"
          >
            Continue to Review
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500 sm:text-sm">
          By continuing you agree to our Terms & Conditions.
        </p>
      </FormContainer>
    </div>
  );
}
