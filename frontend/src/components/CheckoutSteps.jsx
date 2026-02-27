import { IoCaretForwardSharp } from 'react-icons/io5';
import { Link } from 'react-router-dom';

export default function CheckoutSteps({ step1, step2, step3, step4 }) {
  const linkClass = 'text-sm font-medium text-primary-600 hover:underline sm:text-base';
  const disabledClass = 'cursor-not-allowed text-slate-400 no-underline text-sm sm:text-base';
  return (
    <div className="mb-6 flex flex-wrap justify-center gap-1 sm:mb-8 sm:gap-2">
      <span>{step1 ? <Link to="/login" className={linkClass}>Login</Link> : <span className={disabledClass}>Login</span>}</span>
      <IoCaretForwardSharp className="h-4 w-4 shrink-0 text-slate-400" />
      <span>{step2 ? <Link to="/shipping" className={linkClass}>Shipping</Link> : <span className={disabledClass}>Shipping</span>}</span>
      <IoCaretForwardSharp className="h-4 w-4 shrink-0 text-slate-400" />
      <span>{step3 ? <Link to="/payment" className={linkClass}>Payment</Link> : <span className={disabledClass}>Payment</span>}</span>
      <IoCaretForwardSharp className="h-4 w-4 shrink-0 text-slate-400" />
      <span>{step4 ? <Link to="/placeorder" className={linkClass}>Place Order</Link> : <span className={disabledClass}>Place Order</span>}</span>
    </div>
  );
}
