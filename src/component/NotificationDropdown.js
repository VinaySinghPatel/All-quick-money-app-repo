import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainContext from '../Context/mainContext';
import { ClipLoader } from 'react-spinners';
import toast from '../utils/toast';

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const context = useContext(MainContext);
  const { getAllNotifications } = context;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const userId = localStorage.getItem('userId');

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Bootstrap md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllNotifications();
      if (result.success && result.data) {
        setNotifications(result.data);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [getAllNotifications]);

  useEffect(() => {
    if (showDropdown && localStorage.getItem('Authtoken')) {
      fetchNotifications();
    }
  }, [showDropdown, fetchNotifications]);

  // Auto-refresh notifications every 30 seconds when dropdown is open
  useEffect(() => {
    if (!showDropdown) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [showDropdown, fetchNotifications]);

  const handleNotificationClick = (notification) => {
    // Navigate to detail page for loan_request notifications that are pending and received by current user
    if (
      notification.type === 'loan_request' &&
      notification.status === 'pending' &&
      !notification.isSentByMe
    ) {
      setShowDropdown(false);
      navigate(`/notification-detail/${notification._id}`);
    } else {
      // For other notifications, just show info
      toast.show('Info', notification.message || 'Notification details');
    }
  };

  const pendingCount = notifications.filter(
    (notif) => notif.status === 'pending' && !notif.isSentByMe
  ).length;

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'loan_request':
        return 'bi-wallet2';
      case 'loan_response':
        return 'bi-check-circle';
      default:
        return 'bi-bell';
    }
  };

  const getNotificationColor = (type, status) => {
    if (type === 'loan_request' && status === 'pending') {
      return '#ffc107'; // Warning/yellow
    } else if (type === 'loan_response') {
      if (status === 'accepted') return '#28a745'; // Green
      if (status === 'rejected') return '#dc3545'; // Red
    }
    return '#6c757d'; // Gray
  };

  if (!localStorage.getItem('Authtoken')) {
    return null;
  }

  return (
    <>
      <div className="position-relative" style={{ marginLeft: '10px' }}>
        <button
          className="btn position-relative"
          onClick={() => {
            if (isMobile) {
              navigate('/notifications');
            } else {
              setShowDropdown(!showDropdown);
            }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#000',
            fontSize: '1.3rem',
            padding: '0.5rem',
          }}
        >
          <i className="bi bi-bell-fill"></i>
          {pendingCount > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: '0.7rem', padding: '2px 6px' }}
            >
              {pendingCount > 9 ? '9+' : pendingCount}
            </span>
          )}
        </button>

        {showDropdown && (
          <>
            <div
              className="position-fixed top-0 start-0 w-100 h-100"
              style={{ zIndex: 1040 }}
              onClick={() => setShowDropdown(false)}
            ></div>
            <div
              className="position-absolute end-0 mt-2"
              style={{
                width: '350px',
                maxHeight: '500px',
                background: '#fff',
                border: '2px solid #000',
                borderRadius: '15px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                zIndex: 1050,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                className="p-3 border-bottom"
                style={{
                  background: 'linear-gradient(135deg, #8456ce, #4066df)',
                  color: '#fff',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Notifications</span>
                <button
                  className="btn btn-sm"
                  onClick={() => setShowDropdown(false)}
                  style={{ color: '#fff', padding: '0' }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div
                style={{
                  overflowY: 'auto',
                  maxHeight: '400px',
                  background: '#f8f9fa',
                }}
              >
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center p-4">
                    <ClipLoader color="#4066df" size={30} />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center p-4 text-muted">
                    <i className="bi bi-bell-slash" style={{ fontSize: '2rem' }}></i>
                    <p className="mt-2 mb-0">No notifications</p>
                  </div>
                ) : (
                  notifications.slice(0, 2).map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      style={{
                        padding: '1rem',
                        borderBottom: '1px solid #dee2e6',
                        cursor: 'pointer',
                        background:
                          notification.type === 'loan_request' &&
                          notification.status === 'pending' &&
                          !notification.isSentByMe
                            ? '#fff3cd'
                            : '#fff',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e9ecef';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          notification.type === 'loan_request' &&
                          notification.status === 'pending' &&
                          !notification.isSentByMe
                            ? '#fff3cd'
                            : '#fff';
                      }}
                    >
                      <div className="d-flex align-items-start">
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: getNotificationColor(
                              notification.type,
                              notification.status
                            ),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            marginRight: '10px',
                            flexShrink: 0,
                          }}
                        >
                          <i className={`bi ${getNotificationIcon(notification.type)}`}></i>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 'bold',
                              fontSize: '0.9rem',
                              marginBottom: '4px',
                              color: '#000',
                            }}
                          >
                            {notification.isSentByMe
                              ? `You sent: ${notification.message}`
                              : notification.message}
                          </div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: '#6c757d',
                            }}
                          >
                            {formatDate(notification.timestamp)}
                          </div>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              marginTop: '4px',
                            }}
                          >
                            <span
                              className={`badge ${
                                notification.status === 'pending'
                                  ? 'bg-warning'
                                  : notification.status === 'accepted'
                                  ? 'bg-success'
                                  : 'bg-danger'
                              }`}
                            >
                              {notification.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div
                className="p-3 border-top"
                style={{
                  background: '#fff',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <button
                  className="btn btn-primary w-100"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/notifications');
                  }}
                  style={{
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #8456ce, #4066df)',
                    border: 'none',
                  }}
                >
                  <i className="bi bi-list-ul me-2"></i>See All
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default NotificationDropdown;

