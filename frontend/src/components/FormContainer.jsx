export default function FormContainer({ children, className = '' }) {
  return (
    <div className={`flex flex-col rounded-lg bg-white p-10 shadow-md ${className}`}>
      {children}
    </div>
  );
}
