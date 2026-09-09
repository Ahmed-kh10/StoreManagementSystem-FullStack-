import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Sun,
  Moon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/providers/AuthProvider';
import { useBasket } from '@/features/basket/hooks/useBasket';
import { useToast } from '@/app/providers/ToastProvider';
import { useTheme } from '@/app/providers/ThemeProvider';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `font-body text-sm transition-colors ${
    isActive ? 'text-accent' : 'text-muted hover:text-text'
  }`;

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `font-body text-base py-2 transition-colors ${
    isActive ? 'text-accent' : 'text-text/80'
  }`;

export function Navbar() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { showToast } = useToast();
  const { isAuthenticated, user, logout } = useAuth();
  const { data: basket } = useBasket();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const itemCount =
    basket?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const isAdmin = user?.roles.includes('Admin') ?? false;

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function handleLogout() {
    logout();
    showToast(t('auth.loginSuccess'), 'success');
    closeMobileMenu();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl text-accent">
          Store
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            {t('nav.products')}
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/orders" className={navLinkClass}>
              {t('nav.orders')}
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              {t('nav.admin')}
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <button
            onClick={toggleTheme}
            className="text-muted hover:text-text transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link
            to="/basket"
            className="relative text-muted hover:text-text transition-colors"
            aria-label={t('nav.cart')}
          >
            <ShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-bg text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/account"
                className="text-muted hover:text-text transition-colors"
                aria-label={t('nav.account')}
                title={user?.displayName}
              >
                <User size={20} />
              </Link>
              <button
                onClick={handleLogout}
                className="text-muted hover:text-danger transition-colors"
                aria-label={t('nav.logout')}
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-4">
              <Link
                to="/login"
                className="font-body text-sm text-accent hover:underline"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="font-body text-sm text-muted hover:text-text"
              >
                {t('nav.register')}
              </Link>
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="sm:hidden text-muted hover:text-text transition-colors"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="sm:hidden border-t border-border bg-bg px-6 py-4 flex flex-col">
          <NavLink
            to="/"
            end
            className={mobileNavLinkClass}
            onClick={closeMobileMenu}
          >
            {t('nav.home')}
          </NavLink>
          <NavLink
            to="/products"
            className={mobileNavLinkClass}
            onClick={closeMobileMenu}
          >
            {t('nav.products')}
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink
                to="/orders"
                className={mobileNavLinkClass}
                onClick={closeMobileMenu}
              >
                {t('nav.orders')}
              </NavLink>
              <NavLink
                to="/account"
                className={mobileNavLinkClass}
                onClick={closeMobileMenu}
              >
                {t('nav.account')}
              </NavLink>
            </>
          )}

          {isAdmin && (
            <NavLink
              to="/admin"
              className={mobileNavLinkClass}
              onClick={closeMobileMenu}
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard size={16} />
                {t('nav.admin')}
              </span>
            </NavLink>
          )}

          <div className="border-t border-border mt-2 pt-3">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="font-body text-base text-danger py-2"
              >
                {t('nav.logout')}
              </button>
            ) : (
              <div className="flex flex-col gap-1">
                <NavLink
                  to="/login"
                  className={mobileNavLinkClass}
                  onClick={closeMobileMenu}
                >
                  {t('nav.login')}
                </NavLink>
                <NavLink
                  to="/register"
                  className={mobileNavLinkClass}
                  onClick={closeMobileMenu}
                >
                  {t('nav.register')}
                </NavLink>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
