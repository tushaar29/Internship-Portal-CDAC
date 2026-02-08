import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getStudentProfile } from "../api/studentApi";
import { getCompanyProfile } from "../api/companyApi";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (auth?.role === 'STUDENT') {
          const res = await getStudentProfile();
          setUserProfile(res.data);
        } else if (auth?.role === 'COMPANY') {
          const res = await getCompanyProfile();
          setUserProfile(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    if (auth) {
      fetchProfile();
    }
  }, [auth]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
    setShowProfileMenu(false);
  };

  const closeMenu = () => setIsOpen(false);

  // Helper to get display name and image
  const getDisplayName = () => {
    if (!userProfile) return "User";
    return userProfile.fullName || userProfile.companyName || "User";
  };

  const getProfileImage = () => {
    if (userProfile?.profilePicUrl) return userProfile.profilePicUrl;
    if (userProfile?.logo) return userProfile.logo;
    // Fallback to UI Avatars
    const name = getDisplayName();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <div className={styles.topNav}>
        <div className={styles.topNavContainer}>
          <div className={styles.topNavLinks}>
            <Link to="/" className={`${styles.navLink} ${styles.topNavLink}`}>
              Home
            </Link>
            <Link to="/internships" className={`${styles.navLink} ${styles.topNavLink}`}>
              Find Job
            </Link>
            <a href="#employers" className={`${styles.navLink} ${styles.topNavLink}`}>
              Employers
            </a>
            <a href="#candidates" className={`${styles.navLink} ${styles.topNavLink}`}>
              Candidates
            </a>
          </div>
          <div className={styles.topNavRight}>
            <div className={styles.phoneContact}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="#18191C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>+1-202-555-0178</span>
            </div>
            <div className={styles.languageSelector}>
              <span>English</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6L8 10L12 6" stroke="#5E6670" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={styles.mainNav}>
        <div className={styles.navContainer}>
          <div className={styles.navLeft}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoIcon}>I</span>
              <span className={styles.logoText}>Intersify</span>
            </Link>
            <div className={styles.searchBox}>
              <div className={styles.searchLocation}>
                <span>All</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="#5E6670" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.searchDivider}></div>
              <div className={styles.searchInput}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="#9199A3" strokeWidth="2"/>
                  <path d="M16.65 16.65L21 21" stroke="#9199A3" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input type="text" placeholder="Job title, keyword, company" />
              </div>
            </div>
          </div>

          <button
            className={styles.menuToggle}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <span className={styles.hamburger}></span>
            <span className={styles.hamburger}></span>
            <span className={styles.hamburger}></span>
          </button>

          <ul className={`${styles.navMenu} ${isOpen ? styles.active : ""}`}>
            <li className={styles.navItem}>
              <Link to="/internships" className={styles.navLink} onClick={closeMenu}>
                Jobs
              </Link>
            </li>

            {!auth && (
              <>
                <li className={styles.navItem}>
                  <Link to="/login" className={`${styles.navLink} ${styles.btnOutline}`} onClick={closeMenu}>
                    Sign in
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/register" className={`${styles.navLink} ${styles.btnPrimary}`} onClick={closeMenu}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}

            {auth?.role === "STUDENT" && (
              <>
                <li className={styles.navItem}>
                  <Link to="/student/dashboard" className={styles.navLink} onClick={closeMenu}>
                    Dashboard
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/student/applications" className={styles.navLink} onClick={closeMenu}>
                    Applications
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/student/certificates" className={styles.navLink} onClick={closeMenu}>
                    Certificates
                  </Link>
                </li>
                {/* Profile Dropdown */}
                <li className={styles.navItem} ref={dropdownRef}>
                  <div 
                    className={styles.userProfile} 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <img 
                      src={getProfileImage()} 
                      alt="Profile" 
                      className={styles.avatar} 
                    />
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>{getDisplayName()}</span>
                      <span className={styles.userRole}>Student</span>
                    </div>

                    <div className={`${styles.dropdownMenu} ${showProfileMenu ? styles.active : ''}`}>
                       <Link to="/student/profile" className={styles.dropdownItem} onClick={() => { closeMenu(); setShowProfileMenu(false); }}>
                        Profile
                      </Link>
                      <button className={styles.logoutBtn} onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  </div>
                </li>
              </>
            )}

            {auth?.role === "COMPANY" && (
              <>
                <li className={styles.navItem}>
                  <Link to="/company/dashboard" className={styles.navLink} onClick={closeMenu}>
                    Dashboard
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link to="/company/internships" className={styles.navLink} onClick={closeMenu}>
                    My Jobs
                  </Link>
                </li>
                 {/* Profile Dropdown */}
                 <li className={styles.navItem} ref={dropdownRef}>
                  <div 
                    className={styles.userProfile} 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <img 
                      src={getProfileImage()} 
                      alt="Profile" 
                      className={styles.avatar} 
                    />
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>{getDisplayName()}</span>
                      <span className={styles.userRole}>Company</span>
                    </div>

                    <div className={`${styles.dropdownMenu} ${showProfileMenu ? styles.active : ''}`}>
                       <Link to="/company/profile" className={styles.dropdownItem} onClick={() => { closeMenu(); setShowProfileMenu(false); }}>
                        Profile
                      </Link>
                      <button className={styles.logoutBtn} onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  </div>
                </li>
              </>
            )}

            {auth?.role === "ADMIN" && (
              <>
                <li className={styles.navItem}>
                  <Link to="/admin/dashboard" className={styles.navLink} onClick={closeMenu}>
                    Admin Panel
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <button className={styles.logoutBtn} onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
