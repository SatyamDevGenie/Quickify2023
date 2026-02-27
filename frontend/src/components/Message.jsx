export default function Message({ type = 'info', children, className = '' }) {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };
  const icon = type === 'error' ? '⚠' : type === 'success' ? '✓' : 'ℹ';
  return (
    <div className={`rounded-lg border p-4 ${styles[type] || styles.info} ${className}`.trim()}>
      <span className="mr-2 font-semibold">{icon}</span>
      <span>{children}</span>
    </div>
  );
}
