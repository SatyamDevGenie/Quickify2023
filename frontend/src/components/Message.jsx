export default function Message({ type = 'info', children, className = '' }) {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    info: 'bg-sky-50 border-sky-200 text-sky-800',
  };
  const icon = type === 'error' ? '⚠' : type === 'success' ? '✓' : 'ℹ';
  return (
    <div className={`rounded-lg border p-3 text-sm sm:p-4 sm:text-base ${styles[type] || styles.info} ${className}`.trim()}>
      <span className="mr-2 font-semibold">{icon}</span>
      <span>{children}</span>
    </div>
  );
}
