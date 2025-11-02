import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainContext from '../Context/mainContext';
import { ClipLoader } from 'react-spinners';
import toast from '../utils/toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AllNotifications = () => {
  const navigate = useNavigate();
  const context = useContext(MainContext);
  const { getAllNotifications, respondToNotification } = context;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState(null);

  const userId = localStorage.getItem('userId');

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
    AOS.init({ duration: 1000, once: true });
    if (localStorage.getItem('Authtoken')) {
      fetchNotifications();
    } else {
      toast.show('Error', 'Please log in to view notifications.');
    }
  }, [fetchNotifications]);

  const handleNotificationClick = (notification) => {
    // Navigate to detail page for loan_request notifications that are pending and received by current user
    if (
      notification.type === 'loan_request' &&
      notification.status === 'pending' &&
      !notification.isSentByMe
    ) {
      navigate(`/notification-detail/${notification._id}`);
    } else {
      // For other notifications, just show info
      toast.show('Info', notification.message || 'Notification details');
    }
  };

  const handleQuickRespond = async (notification, response) => {
    if (notification.type !== 'loan_request' || notification.status !== 'pending' || notification.isSentByMe) {
      return;
    }

    setRespondingTo(notification._id);
    try {
      const result = await respondToNotification(notification._id, response);
      if (result.success) {
        toast.show(
          'Success',
          response === 'accepted'
            ? 'Loan request accepted successfully!'
            : 'Loan request rejected.'
        );
        // Refresh notifications
        fetchNotifications();
      } else {
        toast.show('Error', result.error || 'Failed to respond to notification.');
      }
    } catch (error) {
      console.error('Error responding to notification:', error);
      toast.show('Error', 'An error occurred while responding to the notification.');
    } finally {
      setRespondingTo(null);
    }
  };

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
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Please log in to view notifications.
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ 
        background: 'transparent',
        minHeight: '100vh', 
        color: '#000',
        width: '100%',
        position: 'relative',
      }}>
        <div className="container-fluid px-4 px-md-5 py-5">
          <div
            className="mb-4"
            style={{
              background: 'linear-gradient(135deg, #8456ce, #4066df)',
              color: '#fff',
              padding: '1.5rem',
              borderRadius: '15px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            }}
          >
            <h2 className="mb-0">
              <i className="bi bi-bell-fill me-2"></i>All Notifications
            </h2>
            <p className="mb-0 mt-2" style={{ opacity: 0.9 }}>
              Manage your loan requests and responses
            </p>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
              <ClipLoader color="#4066df" size={50} />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center p-5">
              <i className="bi bi-bell-slash" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
              <h4 className="mt-3" style={{ color: '#6c757d' }}>No notifications</h4>
              <p style={{ color: '#6c757d' }}>You don't have any notifications yet.</p>
            </div>
          ) : (
            <div className="row g-2">
              {notifications.map((notification, index) => (
                <div key={notification._id} className="col-12 mb-2" data-aos="fade-up" data-aos-delay={index * 50}>
                  <div
                    className="card h-100"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(15px)',
                      border: '2px solid #000',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-10px)';
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <div
                      className="card-header d-flex align-items-center justify-content-between"
                      style={{
                        background: `linear-gradient(135deg, ${getNotificationColor(
                          notification.type,
                          notification.status
                        )}, ${getNotificationColor(notification.type, notification.status)}dd)`,
                        color: '#fff',
                        borderBottom: '2px solid #000',
                        padding: '0.75rem 1rem',
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '15px',
                          }}
                        >
                          <i className={`bi ${getNotificationIcon(notification.type)}`} style={{ fontSize: '1.5rem' }}></i>
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold">{notification.type === 'loan_request' ? 'Loan Request' : 'Loan Response'}</h6>
                          <small style={{ opacity: 0.9 }}>{formatDate(notification.timestamp)}</small>
                        </div>
                      </div>
                      <span
                        className={`badge ${
                          notification.status === 'pending'
                            ? 'bg-warning text-dark'
                            : notification.status === 'accepted'
                            ? 'bg-success'
                            : 'bg-danger'
                        }`}
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                      >
                        {notification.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="card-body p-3">
                      <p className="card-text mb-2" style={{ color: '#000', fontWeight: '500', fontSize: '1rem' }}>
                        {notification.isSentByMe
                          ? `You sent: ${notification.message}`
                          : notification.message}
                      </p>

                      {/* Show sender info if available */}
                      {notification.senderProfile && (
                        <div className="mb-2 pb-2 border-bottom">
                          <small className="d-block mb-1" style={{ color: '#000' }}>
                            <strong>From:</strong> {notification.senderProfile.name || 'Unknown'}
                          </small>
                          {(notification.senderProfile.city || notification.senderProfile.state) && (
                            <small style={{ color: '#000' }}>
                              <i className="bi bi-geo-alt me-1"></i>
                              {notification.senderProfile.city || ''}
                              {notification.senderProfile.city && notification.senderProfile.state && ', '}
                              {notification.senderProfile.state || ''}
                            </small>
                          )}
                        </div>
                      )}

                      {/* Quick respond buttons for pending loan requests received by user */}
                      {notification.type === 'loan_request' &&
                        notification.status === 'pending' &&
                        !notification.isSentByMe && (
                          <div className="d-flex gap-2 mt-2 justify-content-end">
                            <button
                              className="btn btn-success"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickRespond(notification, 'accepted');
                              }}
                              disabled={respondingTo === notification._id}
                              style={{ borderRadius: '10px', padding: '0.4rem 0.8rem', fontSize: '0.85rem', minWidth: 'auto' }}
                            >
                              {respondingTo === notification._id ? (
                                <>
                                  <ClipLoader color="#fff" size={12} className="me-1" />
                                  <span style={{ fontSize: '0.8rem' }}>Accepting...</span>
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-check-circle me-1"></i>Accept
                                </>
                              )}
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuickRespond(notification, 'rejected');
                              }}
                              disabled={respondingTo === notification._id}
                              style={{ borderRadius: '10px', padding: '0.4rem 0.8rem', fontSize: '0.85rem', minWidth: 'auto' }}
                            >
                              {respondingTo === notification._id ? (
                                <>
                                  <ClipLoader color="#fff" size={12} className="me-1" />
                                  <span style={{ fontSize: '0.8rem' }}>Rejecting...</span>
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-x-circle me-1"></i>Reject
                                </>
                              )}
                            </button>
                            <button
                              className="btn btn-outline-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNotificationClick(notification);
                              }}
                              style={{ borderRadius: '10px', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                            >
                              <i className="bi bi-eye me-1"></i>Details
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllNotifications;

