export default function FormContainer({ children, className = '' }) {
  return (
    <div className={`w-full max-w-full flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
}
