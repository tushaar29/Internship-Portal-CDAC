import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Globe } from 'lucide-react';
import styles from './Navigation.module.css';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  // Handle scroll for navbar elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search on Enter key
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/internships?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Find Job', path: '/internships' },
    { label: 'Employers', path: '#employers' },
    { label: 'Candidates', path: '#candidates' },
    { label: 'Pricing', path: '#pricing' },
    { label: 'Support', path: '#support' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Navigation Bar - Premium Glass Effect */}
      <div className={styles['top-nav']}>
        <div className={styles['top-nav-container']}>
          <div className={styles['top-nav-links']}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${styles['nav-link']} ${isActive(link.path) ? styles['active'] : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className={styles['top-nav-right']}>
            <div className={styles['phone-contact']}>
              <Phone size={20} className={styles['phone-icon']} />
              <span>+1-202-555-0178</span>
            </div>
            <div className={styles['language-selector']}>
              <Globe size={20} />
              <span>English</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`${styles['main-nav']} ${isScrolled ? styles['elevated'] : ''}`}>
        <div className={styles['nav-container']}>
          <div className={styles['nav-left']}>
            {/* Logo */}
            <Link to="/" className={styles['logo-brand']}>
              <div className={styles['logo-icon']}>
                <span className={styles['logo-text']}>Intersify</span>
              </div>
            </Link>

            {/* Search Box - Desktop */}
            <div className={`${styles['search-box-container']} ${styles['hidden-mobile']}`}>
              <div className={styles['search-box']}>
                <svg
                  className={styles['search-icon']}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Job title, keyword, company"
                  className={styles['search-input']}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                />
              </div>
            </div>
          </div>

          {/* Hamburger Menu */}
          <button
            className={`${styles['menu-toggle']} ${isOpen ? styles['active'] : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

          {/* Navigation Buttons */}
          <div className={styles['nav-buttons']}>
            <Link to="/login" className={`${styles['btn']} ${styles['btn-outline']}`}>
              Sign In
            </Link>
            <Link to="/register" className={`${styles['btn']} ${styles['btn-primary']}`}>
              Post a Job
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className={styles['mobile-menu']}>
            <div className={styles['mobile-menu-content']}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${styles['mobile-nav-link']} ${isActive(link.path) ? styles['active'] : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className={styles['mobile-search-box']}>
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className={styles['search-input']}
                />
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;
