export function Footer() {
    return (
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>© {new Date().getFullYear()} MyApp. All rights reserved.</span>
          <ul className="flex gap-4">
            <li>
              <a
                href="/tc"
                className="hover:text-blue-600 transition-colors"
              >
                T&C
              </a>
            </li>
            <li>
              <a
                href="/privacy"
                className="hover:text-blue-600 transition-colors"
              >
                Privacy
              </a>
            </li>
          </ul>
        </div>
      </footer>
    );
  }
  