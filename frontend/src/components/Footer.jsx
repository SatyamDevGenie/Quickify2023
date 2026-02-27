export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-black py-6 text-center sm:py-8">
      <p className="px-4 text-sm text-slate-300 sm:text-base">
        © {new Date().getFullYear()} CartBuddy. All rights reserved.
      </p>
    </footer>
  );
}
