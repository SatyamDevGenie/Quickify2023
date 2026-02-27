import { IoCaretForwardSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';

export default function CheckoutSteps({ step1, step2, step3, step4 }) {
  const linkClass = 'text-primary-600 hover:underline';
  const disabledClass = 'cursor-not-allowed text-gray-400 no-underline';
  return (
    <div className="mb-8 flex justify-center">
      <div className="flex items-center gap-2">
        <span>
          {step1 ? (
            <Link to="/login" className={linkClass}>Login</Link>
          ) : (
            <span className={disabledClass}>Login</span>
          )}
        </span>
        <IoCaretForwardSharp className="text-gray-500" />
        <span>
          {step2 ? (
            <Link to="/shipping" className={linkClass}>Shipping</Link>
          ) : (
            <span className={disabledClass}>Shipping</span>
          )}
        </span>
        <IoCaretForwardSharp className="text-gray-500" />
        <span>
          {step3 ? (
            <Link to="/payment" className={linkClass}>Payment</Link>
          ) : (
            <span className={disabledClass}>Payment</span>
          )}
        </span>
        <IoCaretForwardSharp className="text-gray-500" />
        <span>
          {step4 ? (
            <Link to="/placeorder" className={linkClass}>Place Order</Link>
          ) : (
            <span className={disabledClass}>Place Order</span>
          )}
        </span>
      </div>
    </div>
  );
}
