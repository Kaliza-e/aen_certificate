import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, Image as ImageIcon, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isPostEdit = location.pathname.includes('post-edit');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className="bg-navy-900 border-b border-navy-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 py-2 sm:h-16 sm:py-0">
          {/* Logo + title */}
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/dashboard" className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-serif text-lg font-bold">A</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-white text-sm font-semibold tracking-tight truncate">
                  Certificate Generator
                </h1>
                <p className="text-white/40 text-[10px] tracking-widest uppercase truncate">
                  African Entrepreneurs Network
                </p>
              </div>
            </Link>
          </div>

          {/* Nav links (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                !isPostEdit
                  ? 'text-white bg-white/10'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              Certificates
            </Link>
            <Link
              to="/dashboard/post-edit"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                isPostEdit
                  ? 'text-white bg-white/10'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon size={14} />
              Post Edit
            </Link>
          </div>

          {/* User info + logout */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-white/90 text-sm font-medium truncate max-w-[160px]">{user?.name}</p>
              <p className="text-white/40 text-xs truncate max-w-[160px]">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              aria-label="Logout"
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-all shrink-0"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="md:hidden flex items-center justify-center p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all shrink-0"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <nav className="md:hidden border-t border-navy-800 bg-navy-900">
          <div className="px-4 py-3 flex flex-col gap-1">
            <Link
              to="/dashboard"
              className={`px-3 py-2.5 rounded-lg text-sm transition-all ${
                !isPostEdit
                  ? 'text-white bg-white/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Certificates
            </Link>
            <Link
              to="/dashboard/post-edit"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isPostEdit
                  ? 'text-white bg-white/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon size={15} />
              Post Edit
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
