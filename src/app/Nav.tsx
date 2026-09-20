import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ReceiptText, BookOpen, GitFork, Map, BarChart3, Archive, Info } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/story', label: 'Story', icon: BookOpen },
  { path: '/threads', label: 'Threads', icon: GitFork },
  { path: '/map', label: 'Life Map', icon: Map },
  { path: '/patterns', label: 'Patterns', icon: BarChart3 },
  { path: '/archive', label: 'Archive', icon: Archive },
  { path: '/method', label: 'Method', icon: Info },
];

export const Nav: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMobileMenuOpen(false);
  }

  // Handle Escape key for mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <nav className="relative bg-slip border-b border-rule" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group cursor-pointer focus-visible:ring-2 focus-visible:ring-ink rounded-xs p-1"
          >
            <div className="w-8 h-8 rounded-xs bg-ink text-paper flex items-center justify-center font-bold shadow-xs group-hover:bg-stamp-red transition-colors">
              <ReceiptText size={18} aria-hidden="true" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-ink block leading-tight">
                Itemized
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-ink-soft block">
                Your Life, In Receipts
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                aria-current={location.pathname === path ? 'page' : undefined}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors ${
                    isActive
                      ? 'bg-ink text-paper shadow-xs'
                      : 'text-ink-soft hover:text-ink hover:bg-paper-deep'
                  }`
                }
              >
                <Icon size={14} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              ref={menuButtonRef}
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="cursor-pointer p-2 rounded-xs text-ink hover:bg-paper-deep transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              {mobileMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          ref={mobilePanelRef}
          className="md:hidden border-t border-dashed border-rule bg-paper p-4 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150"
        >
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              aria-current={location.pathname === path ? 'page' : undefined}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 font-mono text-sm uppercase tracking-wider font-semibold rounded-xs transition-colors ${
                  isActive
                    ? 'bg-ink text-paper'
                    : 'text-ink-soft hover:text-ink hover:bg-paper-deep'
                }`
              }
            >
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};
