import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainContext from '../Context/mainContext';
import { ClipLoader } from 'react-spinners';
import toast from '../utils/toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

const NotificationUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useContext(MainContext);
  const { getAllNotifications, respondToNotification } = context;
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(false);
  const [action, setAction] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    fetchNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchNotification = async () => {
    setLoading(true);
    try {
      const result = await getAllNotifications();
      if (result.success && result.data) {
        const foundNotification = result.data.find(notif => notif._id === id);
        if (foundNotification) {
          setNotification(foundNotification);
        } else {
          toast.show('Error', 'Notification not found.');
          navigate('/notifications');
        }
      } else {
        toast.show('Error', 'Failed to fetch notification.');
        navigate('/notifications');
      }
    } catch (error) {
      console.error('Error fetching notification:', error);
      toast.show('Error', 'An error occurred while fetching notification.');
      navigate('/notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (response) => {
    if (!notification) return;
    
    setAction(response);
    setResponding(true);
    try {
      const result = await respondToNotification(notification._id, response);
      if (result.success) {
        toast.show(
          'Success',
          response === 'accepted'
            ? 'Loan request accepted successfully!'
            : 'Loan request rejected.'
        );
        // Refresh notification data
        fetchNotification();
      } else {
        toast.show('Error', result.error || 'Failed to respond to notification.');
      }
    } catch (error) {
      console.error('Error responding to notification:', error);
      toast.show('Error', 'An error occurred while responding to the notification.');
    } finally {
      setResponding(false);
      setAction(null);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid px-4 px-md-5 py-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <ClipLoader color="#4066df" size={50} />
        </div>
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="container-fluid px-4 px-md-5 py-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Notification not found.
        </div>
      </div>
    );
  }

  const senderProfile = notification.senderProfile || {};
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div style={{ 
      background: 'transparent',
      minHeight: '100vh', 
      color: '#000',
      width: '100%',
      position: 'relative',
    }}>
      <div className="container-fluid px-4 px-md-5 py-5">
        <div className="row">
          <div className="col-12">
            {/* Header */}
            <div
              className="mb-4"
              style={{
                background: 'linear-gradient(135deg, #8456ce, #4066df)',
                color: '#fff',
                padding: '1.5rem',
                borderRadius: '15px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              }}
              data-aos="fade-down"
            >
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="mb-0">
                    <i className="bi bi-wallet2 me-2"></i>Loan Request Details
                  </h2>
                  <p className="mb-0 mt-2" style={{ opacity: 0.9 }}>
                    Review borrower information and respond to the request
                  </p>
                </div>
                <button
                  className="btn btn-light"
                  onClick={() => navigate('/notifications')}
                  style={{ borderRadius: '10px' }}
                >
                  <i className="bi bi-arrow-left me-2"></i>Back
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <div
                  className="card"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(15px)',
                    border: '2px solid #000',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  }}
                  data-aos="fade-up"
                >
                  {/* Card Header */}
                  <div
                    className="card-header"
                    style={{
                      background: 'linear-gradient(135deg, #8456ce, #4066df)',
                      color: '#fff',
                      borderBottom: '2px solid #000',
                      padding: '1rem 1.5rem',
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="mb-0 fw-bold">
                        <i className="bi bi-person-circle me-2"></i>Request From
                      </h5>
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
                  </div>

                  {/* Card Body */}
                  <div className="card-body p-4">
                    {/* User Details */}
                    <div className="mb-4">
                      <div
                        style={{
                          background: '#fff',
                          padding: '1.5rem',
                          borderRadius: '15px',
                          border: '1px solid #dee2e6',
                        }}
                      >
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <strong style={{ color: '#4066df', display: 'block', marginBottom: '0.5rem' }}>Name:</strong>
                            <span style={{ color: '#000' }}>{senderProfile.name || 'Not provided'}</span>
                          </div>
                          <div className="col-md-6 mb-3">
                            <strong style={{ color: '#4066df', display: 'block', marginBottom: '0.5rem' }}>Username:</strong>
                            <span style={{ color: '#000' }}>{senderProfile.username || 'Not provided'}</span>
                          </div>
                          <div className="col-md-6 mb-3">
                            <strong style={{ color: '#4066df', display: 'block', marginBottom: '0.5rem' }}>Email:</strong>
                            <span style={{ color: '#000', wordBreak: 'break-word' }}>{senderProfile.email || 'Not provided'}</span>
                          </div>
                          <div className="col-md-6 mb-3">
                            <strong style={{ color: '#4066df', display: 'block', marginBottom: '0.5rem' }}>Mobile:</strong>
                            <span style={{ color: '#000' }}>{senderProfile.mobilenumber || 'Not provided'}</span>
                          </div>
                          <div className="col-md-6 mb-3">
                            <strong style={{ color: '#4066df', display: 'block', marginBottom: '0.5rem' }}>City:</strong>
                            <span style={{ color: '#000' }}>{senderProfile.city || 'Not provided'}</span>
                          </div>
                          <div className="col-md-6 mb-3">
                            <strong style={{ color: '#4066df', display: 'block', marginBottom: '0.5rem' }}>State:</strong>
                            <span style={{ color: '#000' }}>{senderProfile.state || 'Not provided'}</span>
                          </div>
                          <div className="col-md-6 mb-3">
                            <strong style={{ color: '#4066df', display: 'block', marginBottom: '0.5rem' }}>Country:</strong>
                            <span style={{ color: '#000' }}>{senderProfile.country || 'Not provided'}</span>
                          </div>
                          <div className="col-md-6 mb-3">
                            <strong style={{ color: '#4066df', display: 'block', marginBottom: '0.5rem' }}>Pin Code:</strong>
                            <span style={{ color: '#000' }}>{senderProfile.pinCode || 'Not provided'}</span>
                          </div>
                          {senderProfile.aadharNumber && (
                            <div className="col-md-6 mb-3">
                              <strong style={{ color: '#4066df', display: 'block', marginBottom: '0.5rem' }}>Aadhar Number:</strong>
                              <span style={{ color: '#000' }}>{senderProfile.aadharNumber}</span>
                            </div>
                          )}
                          {senderProfile.panCardNumber && (
                            <div className="col-md-6 mb-3">
                              <strong style={{ color: '#4066df', display: 'block', marginBottom: '0.5rem' }}>PAN Card Number:</strong>
                              <span style={{ color: '#000' }}>{senderProfile.panCardNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3" style={{ color: '#4066df' }}>
                        <i className="bi bi-chat-left-text me-2"></i>Message:
                      </h6>
                      <div
                        style={{
                          background: '#fff',
                          padding: '1rem',
                          borderRadius: '15px',
                          border: '1px solid #dee2e6',
                          color: '#000',
                        }}
                      >
                        {notification.message || 'No message provided'}
                      </div>
                    </div>

                    {/* Request Info */}
                    <div className="mb-4">
                      <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                        <strong>Requested on:</strong> {formatDate(notification.timestamp)}
                      </p>
                    </div>

                    {/* Info Alert */}
                    <div className="alert alert-info mb-4" role="alert" style={{ borderRadius: '10px' }}>
                      <i className="bi bi-info-circle me-2"></i>
                      Please review the borrower's details before accepting or rejecting this loan request.
                    </div>

                    {/* Action Buttons - Only show for pending loan requests received by user */}
                    {notification.type === 'loan_request' &&
                      notification.status === 'pending' &&
                      !notification.isSentByMe && (
                        <div className="d-flex gap-3 justify-content-end">
                          <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/notifications')}
                            style={{ borderRadius: '10px', padding: '0.6rem 1.5rem' }}
                          >
                            <i className="bi bi-arrow-left me-2"></i>Cancel
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleRespond('rejected')}
                            disabled={responding}
                            style={{ borderRadius: '10px', padding: '0.6rem 1.5rem' }}
                          >
                            {responding && action === 'rejected' ? (
                              <>
                                <ClipLoader color="#fff" size={16} className="me-2" />
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-x-circle me-2"></i>Reject
                              </>
                            )}
                          </button>
                          <button
                            className="btn btn-success"
                            onClick={() => handleRespond('accepted')}
                            disabled={responding}
                            style={{ borderRadius: '10px', padding: '0.6rem 1.5rem' }}
                          >
                            {responding && action === 'accepted' ? (
                              <>
                                <ClipLoader color="#fff" size={16} className="me-2" />
                                Accepting...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-check-circle me-2"></i>Accept
                              </>
                            )}
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationUserDetail;

