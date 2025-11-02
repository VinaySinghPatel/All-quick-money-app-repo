import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import API_BASE_URL from '../config/api';

const Navbar = () => {
  let history = useNavigate();
  const Location = useLocation();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handlelogout = () => {
    localStorage.removeItem("Authtoken");
    localStorage.removeItem("userId");
    setShowDropdown(false);
    history("/login");
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('Authtoken');
      const userId = localStorage.getItem('userId');
      
      if (!token) {
        return;
      }

      let response = await fetch(`${API_BASE_URL}/api/auth/getuser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authtoken': token,
        },
      });

      if (!response.ok && userId) {
        response = await fetch(`${API_BASE_URL}/api/auth/GetUserData/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      if (response.ok) {
        const data = await response.json();
        const userData = data.success ? data.user : data;
        if (userData && (userData._id || userData.id)) {
          setUser(userData);
        }
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand font-weight-bold" to="/">
            Quick-Money
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    Location.pathname === "/" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    Location.pathname === "/visit" ? "active" : ""
                  }`}
                  to="/visit"
                >
                  About
                </Link>
              </li>
              {localStorage.getItem("Authtoken") && (
                <li className="nav-item">
                  <Link className={`nav-link`} to="/NewPost">
                    Rent-Money
                  </Link>
                </li>
              )}
              {localStorage.getItem("Authtoken") && (
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      Location.pathname === "/Profile" ? "active" : ""
                    }`}
                    to="/Profile"
                  >
                    Profile
                  </Link>
                </li>
              )}
              {localStorage.getItem("Authtoken") && (
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      Location.pathname === "/MyPost" ? "active" : ""
                    }`}
                    to="/MyPost"
                  >
                    My-Post
                  </Link>
                </li>
              )}
              {localStorage.getItem("Authtoken") && (
                <li className="nav-item">
                  <Link
                    className={`nav-link ${
                      Location.pathname === "/messages" ? "active" : ""
                    }`}
                    to="/messages"
                  >
                    Messages
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    Location.pathname === "/allposts" ? "active" : ""
                  }`}
                  to="/allposts"
                >
                  All Post
                </Link>
              </li>
            </ul>
            {!localStorage.getItem("Authtoken") ? (
              <form className="d-flex align-items-center" role="search">
                <Link
                  className="btn btn-primary mx-2 text-white"
                  to="/Login"
                  role="button"
                >
                  Login
                </Link>
                <Link
                  className="btn btn-primary mx-2 text-white"
                  to="/SignUp"
                  role="button"
                >
                  Sign-Up
                </Link>
              </form>
            ) : (
              <div className="d-flex align-items-center">
                <NotificationDropdown />
                <div className="user-profile-dropdown" ref={dropdownRef}>
                  <div 
                    className="user-profile-trigger"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <div className="user-avatar">
                      {user?.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" />
                      ) : (
                        <div className="avatar-initials">
                          {getInitials(user?.name || 'User')}
                        </div>
                      )}
                    </div>
                    <span className="user-name">{user?.name || 'User'}</span>
                    <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>
                      ▼
                    </span>
                  </div>
                  {showDropdown && (
                    <div className="user-dropdown-menu">
                      <button
                        onClick={handlelogout}
                        className="dropdown-item logout-btn"
                      >
                        <span className="logout-icon">🚪</span>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <style jsx>{`
        .navbar {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(15px);
          box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          margin: 0 !important;
          padding: 0.5rem 1rem !important;
        }

        .navbar-brand {
          font-size: 1.8rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #000 !important;
          text-shadow: none;
        }

        .navbar-brand:hover {
          color: #333 !important;
        }

        .nav-link {
          font-size: 1rem;
          font-weight: 500;
          color: #000 !important;
          transition: all 0.3s ease;
          margin: 0 5px;
          border-radius: 8px;
          padding: 8px 15px !important;
        }

        .nav-link:hover {
          color: #000 !important;
          background: rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .nav-link.active {
          color: #fff !important;
          background: #000;
          font-weight: 600;
        }

        .btn-primary,
        .btn-danger {
          font-size: 1rem;
          font-weight: 500;
          border-radius: 25px;
          padding: 0.5rem 1.5rem;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-primary {
          background: #000 !important;
          color: #fff !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .btn-primary:hover {
          background: #333 !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .btn-danger {
          background: #000 !important;
          color: #fff !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .btn-danger:hover {
          background: #333 !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        .navbar form.d-flex {
          margin: 0;
          padding: 0;
          align-items: center;
        }

        .navbar .container-fluid {
          padding-left: 1rem;
          padding-right: 1rem;
        }

        .navbar-toggler {
          border-color: rgba(0, 0, 0, 0.2);
        }

        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%280, 0, 0, 0.8%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        .user-profile-dropdown {
          position: relative;
          margin-left: 15px;
        }

        .user-profile-trigger {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 5px 12px;
          border-radius: 25px;
          transition: all 0.3s ease;
          background: transparent;
          gap: 8px;
        }

        .user-profile-trigger:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          flex-shrink: 0;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-initials {
          color: white;
          font-weight: 600;
          font-size: 16px;
          text-transform: uppercase;
        }

        .user-name {
          font-weight: 500;
          color: #000;
          font-size: 0.95rem;
          white-space: nowrap;
        }

        .dropdown-arrow {
          font-size: 10px;
          color: #666;
          transition: transform 0.3s ease;
          margin-left: 4px;
        }

        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        .user-dropdown-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
          min-width: 180px;
          padding: 8px;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          width: 100%;
          padding: 12px 16px;
          border: none;
          background: transparent;
          text-align: left;
          cursor: pointer;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 500;
          color: #333;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dropdown-item:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .logout-btn {
          color: #dc3545 !important;
        }

        .logout-btn:hover {
          background: rgba(220, 53, 69, 0.1) !important;
        }

        .logout-icon {
          font-size: 18px;
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0.4rem 0.75rem !important;
          }

          .navbar-brand {
            font-size: 1.3rem;
          }

          .nav-link {
            font-size: 0.85rem;
            padding: 6px 10px !important;
            margin: 0 3px;
          }

          .btn-primary,
          .btn-danger {
            font-size: 0.8rem;
            padding: 0.3rem 0.8rem;
            border: none !important;
            background: transparent !important;
            color: #000 !important;
            box-shadow: none !important;
            font-weight: 500;
          }

          .btn-primary:hover,
          .btn-danger:hover {
            background: rgba(0, 0, 0, 0.05) !important;
            transform: none;
          }

          .user-name {
            display: none;
          }
          
          .dropdown-arrow {
            display: none;
          }

          .user-profile-dropdown {
            margin-left: 8px;
            position: relative;
          }

          .user-profile-trigger {
            padding: 4px 8px;
            gap: 6px;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
          }

          .avatar-initials {
            font-size: 14px;
          }

          .user-dropdown-menu {
            right: 0;
            left: auto;
            min-width: 140px;
            padding: 6px;
            top: calc(100% + 8px);
          }

          .dropdown-item {
            padding: 10px 12px;
            font-size: 0.85rem;
            gap: 8px;
          }

          .logout-icon {
            font-size: 16px;
          }

          .navbar-nav {
            margin-bottom: 0.5rem;
          }

          .d-flex.align-items-center {
            width: 100%;
            justify-content: flex-end;
            margin-top: 0.5rem;
          }

          .navbar .container-fluid {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
