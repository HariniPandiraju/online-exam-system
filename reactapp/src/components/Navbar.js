// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import '../styles/navigation.css';

// const Navbar = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [user, setUser] = useState(null);
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const dropdownRef = useRef(null);
//     const mobileMenuRef = useRef(null);

//     // Get user info from localStorage
//     useEffect(() => {
//         const checkUser = () => {
//             try {
//                 const userData = localStorage.getItem('user');
//                 if (userData) {
//                     const parsedUser = JSON.parse(userData);
//                     setUser(parsedUser);
//                 } else {
//                     setUser(null);
//                 }
//             } catch (error) {
//                 console.error('Error parsing user data:', error);
//                 localStorage.removeItem('user');
//                 setUser(null);
//             }
//         };

//         checkUser();

//         // Listen for storage changes
//         window.addEventListener('storage', checkUser);
//         return () => window.removeEventListener('storage', checkUser);
//     }, []);

//     // Close dropdowns when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setIsDropdownOpen(false);
//             }
//             if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
//                 setIsMobileMenuOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     const handleLogout = () => {
//         // Clear all user data
//         localStorage.removeItem('user');
//         localStorage.removeItem('token');
//         localStorage.removeItem('authToken');
        
//         // Update state
//         setUser(null);
//         setIsDropdownOpen(false);
//         setIsMobileMenuOpen(false);
        
//         // Navigate to home page
//         navigate('/');
        
//         // Show logout message
//         setTimeout(() => {
//             alert('You have been logged out successfully!');
//         }, 100);
//     };

//     const isActiveRoute = (path) => {
//         return location.pathname === path;
//     };

//     function getInitials(fullName) {
//   if (!fullName || typeof fullName !== 'string') return 'U';

//   const names = fullName.trim().split(/\s+/);
//   if (names.length === 1) {
   
//     return names[0].substring(0, 2).toUpperCase();
//   }

 
//   return (names.charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
// }



//     return (
//         <nav className="navbar">
//             <div className="navbar-content">
//                 {/* Brand/Logo */}
//                 <Link to="/" className="navbar-brand">
//                     📚 Online Exam System
//                 </Link>

//                 {/* Desktop Navigation */}
//                 <div className="navbar-nav desktop-nav">
//                     {user ? (
//                         // Authenticated User Navigation
//                         <>
//                             {user.role === 'TEACHER' ? (
//                                 <>
//                                     <Link 
//                                         to="/teacher/dashboard" 
//                                         className={`navbar-link ${isActiveRoute('/teacher/dashboard') ? 'active' : ''}`}
//                                     >
//                                         📊 Dashboard
//                                     </Link>
//                                     <Link 
//                                         to="/create-exam" 
//                                         className={`navbar-link ${isActiveRoute('/create-exam') ? 'active' : ''}`}
//                                     >
//                                         ➕ Create Exam
//                                     </Link>
//                                     <Link 
//                                         to="/question-bank" 
//                                         className={`navbar-link ${isActiveRoute('/question-bank') ? 'active' : ''}`}
//                                     >
//                                         🏦 Question Bank
//                                     </Link>
//                                 </>
//                             ) : (
//                                 <>
//                                     <Link 
//                                         to="/student/dashboard" 
//                                         className={`navbar-link ${isActiveRoute('/student/dashboard') ? 'active' : ''}`}
//                                     >
//                                         🏠 Dashboard
//                                     </Link>
//                                     <Link 
//                                         to="/student/exams" 
//                                         className={`navbar-link ${isActiveRoute('/student/exams') ? 'active' : ''}`}
//                                     >
//                                         📝 My Exams
//                                     </Link>
//                                     <Link 
//                                         to="/student/results" 
//                                         className={`navbar-link ${isActiveRoute('/student/results') ? 'active' : ''}`}
//                                     >
//                                         📈 Results
//                                     </Link>
//                                 </>
//                             )}

//                             {/* User Profile Dropdown */}
//                             <div className="user-profile" ref={dropdownRef}>
//                                 <button 
//                                     className="profile-button"
//                                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                                     aria-haspopup="true"
//                                     aria-expanded={isDropdownOpen}
//                                 >
//                                     <div className="user-avatar">
//                                         {getInitials(user.fullName || user.name || user.username)}
//                                     </div>
//                                     <div className="user-info">
//                                         <span className="user-name">
//                                             {user.fullName || user.name || user.username}
//                                         </span>
//                                         <span className="user-role">
//                                             {user.role?.toLowerCase() || 'user'}
//                                         </span>
//                                     </div>
//                                     <svg 
//                                         className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} 
//                                         width="12" 
//                                         height="12" 
//                                         viewBox="0 0 12 12"
//                                     >
//                                         <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
//                                     </svg>
//                                 </button>

//                                 {isDropdownOpen && (
//                                     <div className="dropdown-menu">
//                                         <div className="dropdown-header">
//                                             <div className="user-avatar-large">
//                                                 {getInitials(user.fullName || user.name || user.username)}
//                                             </div>
//                                             <div>
//                                                 <div className="dropdown-name">
//                                                     {user.fullName || user.name || user.username}
//                                                 </div>
//                                                 <div className="dropdown-email">
//                                                     {user.email || `${user.username}@example.com`}
//                                                 </div>
//                                                 <div className="dropdown-role">
//                                                     {user.role} Account
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="dropdown-divider"></div>
//                                         <Link to="/profile" className="dropdown-item">
//                                             👤 My Profile
//                                         </Link>
//                                         <Link to="/settings" className="dropdown-item">
//                                             ⚙️ Settings
//                                         </Link>
//                                         <Link to="/help" className="dropdown-item">
//                                             ❓ Help & Support
//                                         </Link>
//                                         <div className="dropdown-divider"></div>
//                                         <button onClick={handleLogout} className="dropdown-item logout-btn">
//                                             🚪 Sign Out
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         </>
//                     ) : (
//                         // Guest Navigation
//                         <>
//                             <Link 
//                                 to="/about" 
//                                 className={`navbar-link ${isActiveRoute('/about') ? 'active' : ''}`}
//                             >
//                                 About
//                             </Link>
//                             <Link 
//                                 to="/contact" 
//                                 className={`navbar-link ${isActiveRoute('/contact') ? 'active' : ''}`}
//                             >
//                                 Contact
//                             </Link>
//                             <Link 
//                                 to="/login" 
//                                 className={`navbar-link ${isActiveRoute('/login') ? 'active' : ''}`}
//                             >
//                                 Sign In
//                             </Link>
//                             <Link 
//                                 to="/signup" 
//                                 className="navbar-cta"
//                             >
//                                 Get Started
//                             </Link>
//                         </>
//                     )}
//                 </div>

//                 {/* Mobile Menu Toggle */}
//                 <button 
//                     className="mobile-menu-toggle"
//                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                     aria-label="Toggle mobile menu"
//                 >
//                     <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></span>
//                 </button>
//             </div>

//             {/* Mobile Navigation Menu */}
//             {isMobileMenuOpen && (
//                 <div className="mobile-menu" ref={mobileMenuRef}>
//                     {user ? (
//                         <>
//                             {/* User Info in Mobile */}
//                             <div className="mobile-user-info">
//                                 <div className="user-avatar-mobile">
//                                     {getInitials(user.fullName || user.name || user.username)}
//                                 </div>
//                                 <div>
//                                     <div className="mobile-user-name">
//                                         {user.fullName || user.name || user.username}
//                                     </div>
//                                     <div className="mobile-user-role">
//                                         {user.role} Account
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="mobile-menu-divider"></div>

//                             {user.role === 'TEACHER' ? (
//                                 <>
//                                     <Link 
//                                         to="/teacher/dashboard" 
//                                         className="mobile-menu-item"
//                                         onClick={() => setIsMobileMenuOpen(false)}
//                                     >
//                                         📊 Dashboard
//                                     </Link>
//                                     <Link 
//                                         to="/create-exam" 
//                                         className="mobile-menu-item"
//                                         onClick={() => setIsMobileMenuOpen(false)}
//                                     >
//                                         ➕ Create Exam
//                                     </Link>
//                                     <Link 
//                                         to="/question-bank" 
//                                         className="mobile-menu-item"
//                                         onClick={() => setIsMobileMenuOpen(false)}
//                                     >
//                                         🏦 Question Bank
//                                     </Link>
//                                 </>
//                             ) : (
//                                 <>
//                                     <Link 
//                                         to="/student/dashboard" 
//                                         className="mobile-menu-item"
//                                         onClick={() => setIsMobileMenuOpen(false)}
//                                     >
//                                         🏠 Dashboard
//                                     </Link>
//                                     <Link 
//                                         to="/student/exams" 
//                                         className="mobile-menu-item"
//                                         onClick={() => setIsMobileMenuOpen(false)}
//                                     >
//                                         📝 My Exams
//                                     </Link>
//                                     <Link 
//                                         to="/student/results" 
//                                         className="mobile-menu-item"
//                                         onClick={() => setIsMobileMenuOpen(false)}
//                                     >
//                                         📈 Results
//                                     </Link>
//                                 </>
//                             )}
                            
//                             <div className="mobile-menu-divider"></div>
//                             <Link 
//                                 to="/profile" 
//                                 className="mobile-menu-item"
//                                 onClick={() => setIsMobileMenuOpen(false)}
//                             >
//                                 👤 My Profile
//                             </Link>
//                             <Link 
//                                 to="/settings" 
//                                 className="mobile-menu-item"
//                                 onClick={() => setIsMobileMenuOpen(false)}
//                             >
//                                 ⚙️ Settings
//                             </Link>
//                             <button 
//                                 onClick={handleLogout} 
//                                 className="mobile-menu-item logout-mobile"
//                             >
//                                 🚪 Sign Out
//                             </button>
//                         </>
//                     ) : (
//                         <>
//                             <Link 
//                                 to="/about" 
//                                 className="mobile-menu-item"
//                                 onClick={() => setIsMobileMenuOpen(false)}
//                             >
//                                 About
//                             </Link>
//                             <Link 
//                                 to="/contact" 
//                                 className="mobile-menu-item"
//                                 onClick={() => setIsMobileMenuOpen(false)}
//                             >
//                                 Contact
//                             </Link>
//                             <div className="mobile-menu-divider"></div>
//                             <Link 
//                                 to="/login" 
//                                 className="mobile-menu-item"
//                                 onClick={() => setIsMobileMenuOpen(false)}
//                             >
//                                 Sign In
//                             </Link>
//                             <Link 
//                                 to="/signup" 
//                                 className="mobile-menu-item mobile-cta"
//                                 onClick={() => setIsMobileMenuOpen(false)}
//                             >
//                                 Get Started
//                             </Link>
//                         </>
//                     )}
//                 </div>
//             )}
//         </nav>
//     );
// };

// export default Navbar;

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/navigation.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // Get user info from localStorage
    useEffect(() => {
        const checkUser = () => {
            try {
                const userData = localStorage.getItem('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
                setUser(null);
            }
        };

        checkUser();

        // Listen for storage changes
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        // Clear all user data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        
        // Update state
        setUser(null);
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        
        // Navigate to home page
        navigate('/');
        
        // Show logout message
        setTimeout(() => {
            alert('You have been logged out successfully!');
        }, 100);
    };

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    function getInitials(fullName) {
        if (!fullName || typeof fullName !== 'string') return 'U';

        const names = fullName.trim().split(/\s+/);
        if (names.length === 1) {
            return names[0].substring(0, 2).toUpperCase();
        }

        // Fixed charAt issue
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }

    return (
        <nav className="navbar">
            <div className="navbar-content">
                {/* Brand/Logo */}
                <Link to="/" className="navbar-brand">
                    📚 Online Exam System
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-nav desktop-nav">
                    {user ? (
                        <>
                            {user.role === 'TEACHER' ? (
                                <>
                                    <Link 
                                        to="/teacher/dashboard" 
                                        className={`navbar-link ${isActiveRoute('/teacher/dashboard') ? 'active' : ''}`}
                                    >
                                        📊 Dashboard
                                    </Link>
                                    <Link 
                                        to="/create-exam" 
                                        className={`navbar-link ${isActiveRoute('/create-exam') ? 'active' : ''}`}
                                    >
                                        ➕ Create Exam
                                    </Link>
                                    <Link 
                                        to="/question-bank" 
                                        className={`navbar-link ${isActiveRoute('/question-bank') ? 'active' : ''}`}
                                    >
                                        🏦 Question Bank
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/student/dashboard" 
                                        className={`navbar-link ${isActiveRoute('/student/dashboard') ? 'active' : ''}`}
                                    >
                                        🏠 Dashboard
                                    </Link>
                                    <Link 
                                        to="/student/exams" 
                                        className={`navbar-link ${isActiveRoute('/student/exams') ? 'active' : ''}`}
                                    >
                                        📝 My Exams
                                    </Link>
                                    <Link 
                                        to="/student/results" 
                                        className={`navbar-link ${isActiveRoute('/student/results') ? 'active' : ''}`}
                                    >
                                        📈 Results
                                    </Link>
                                </>
                            )}

                            {/* User Profile Dropdown */}
                            <div className="user-profile" ref={dropdownRef}>
                                <button 
                                    className="profile-button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    aria-haspopup="true"
                                    aria-expanded={isDropdownOpen}
                                >
                                    <div className="user-avatar">
                                        {getInitials(user.fullName || user.name || user.username)}
                                    </div>
                                    <div className="user-info">
                                        <span className="user-name">
                                            {user.fullName || user.name || user.username}
                                        </span>
                                        <span className="user-role">
                                            {user.role?.toLowerCase() || 'user'}
                                        </span>
                                    </div>
                                    <svg 
                                        className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} 
                                        width="12" 
                                        height="12" 
                                        viewBox="0 0 12 12"
                                    >
                                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="dropdown-menu">
                                        <div className="dropdown-header">
                                            <div className="user-avatar-large">
                                                {getInitials(user.fullName || user.name || user.username)}
                                            </div>
                                            <div>
                                                <div className="dropdown-name">
                                                    {user.fullName || user.name || user.username}
                                                </div>
                                                <div className="dropdown-email">
                                                    {user.email || `${user.username}@example.com`}
                                                </div>
                                                <div className="dropdown-role">
                                                    {user.role} Account
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <Link to="/profile" className="dropdown-item">
                                            👤 My Profile
                                        </Link>
                                        <Link to="/settings" className="dropdown-item">
                                            ⚙️ Settings
                                        </Link>
                                        <Link to="/help" className="dropdown-item">
                                            ❓ Help & Support
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button onClick={handleLogout} className="dropdown-item logout-btn">
                                            🚪 Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/about" 
                                className={`navbar-link ${isActiveRoute('/about') ? 'active' : ''}`}
                            >
                                About
                            </Link>
                            <Link 
                                to="/contact" 
                                className={`navbar-link ${isActiveRoute('/contact') ? 'active' : ''}`}
                            >
                                Contact
                            </Link>
                            <Link 
                                to="/login" 
                                className={`navbar-link ${isActiveRoute('/login') ? 'active' : ''}`}
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/signup" 
                                className="navbar-cta"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle mobile menu"
                >
                    <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="mobile-menu" ref={mobileMenuRef}>
                    {user ? (
                        <>
                            {/* User Info in Mobile */}
                            <div className="mobile-user-info">
                                <div className="user-avatar-mobile">
                                    {getInitials(user.fullName || user.name || user.username)}
                                </div>
                                <div>
                                    <div className="mobile-user-name">
                                        {user.fullName || user.name || user.username}
                                    </div>
                                    <div className="mobile-user-role">
                                        {user.role} Account
                                    </div>
                                </div>
                            </div>
                            <div className="mobile-menu-divider"></div>

                            {user.role === 'TEACHER' ? (
                                <>
                                    <Link 
                                        to="/teacher/dashboard" 
                                        className="mobile-menu-item"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        📊 Dashboard
                                    </Link>
                                    <Link 
                                        to="/create-exam" 
                                        className="mobile-menu-item"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        ➕ Create Exam
                                    </Link>
                                    <Link 
                                        to="/question-bank" 
                                        className="mobile-menu-item"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        🏦 Question Bank
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/student/dashboard" 
                                        className="mobile-menu-item"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        🏠 Dashboard
                                    </Link>
                                    <Link 
                                        to="/student/exams" 
                                        className="mobile-menu-item"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        📝 My Exams
                                    </Link>
                                    <Link 
                                        to="/student/results" 
                                        className="mobile-menu-item"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        📈 Results
                                    </Link>
                                </>
                            )}
                            
                            <div className="mobile-menu-divider"></div>
                            <Link 
                                to="/profile" 
                                className="mobile-menu-item"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                👤 My Profile
                            </Link>
                            <Link 
                                to="/settings" 
                                className="mobile-menu-item"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                ⚙️ Settings
                            </Link>
                            <button 
                                onClick={handleLogout} 
                                className="mobile-menu-item logout-mobile"
                            >
                                🚪 Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/about" 
                                className="mobile-menu-item"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link 
                                to="/contact" 
                                className="mobile-menu-item"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                            <div className="mobile-menu-divider"></div>
                            <Link 
                                to="/login" 
                                className="mobile-menu-item"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/signup" 
                                className="mobile-menu-item mobile-cta"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
