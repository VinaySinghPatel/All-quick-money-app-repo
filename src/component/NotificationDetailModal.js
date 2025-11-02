import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainContext from '../Context/mainContext';
import { ClipLoader } from 'react-spinners';
import toast from '../utils/toast';

const NotificationDetailModal = ({ notification, onClose }) => {
  const context = useContext(MainContext);
  const { respondToNotification } = context;
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null); // 'accept' or 'reject'

  const handleRespond = async (response) => {
    setAction(response);
    setLoading(true);
    try {
      const result = await respondToNotification(notification._id, response);
      if (result.success) {
        toast.show(
          'Success',
          response === 'accepted'
            ? 'Loan request accepted successfully!'
            : 'Loan request rejected.'
        );
        onClose();
      } else {
        toast.show('Error', result.error || 'Failed to respond to notification.');
      }
    } catch (error) {
      console.error('Error responding to notification:', error);
      toast.show('Error', 'An error occurred while responding to the notification.');
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  const senderProfile = notification.senderProfile || {};
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div
      className="modal d-block"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 9999,
      }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '600px', zIndex: 10000 }}>
        <div
          className="modal-content"
          style={{
            background: 'linear-gradient(135deg, #fff, #f8f9fa)',
            border: '2px solid #000',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
          }}
        >
          <div
            className="modal-header"
            style={{
              background: 'linear-gradient(90deg, #8456ce, #4066df)',
              color: '#fff',
              borderRadius: '15px 15px 0 0',
              padding: '1rem',
            }}
          >
            <h6 className="modal-title fw-bold mb-0" style={{ fontSize: '1.1rem' }}>
              <i className="bi bi-wallet2 me-2"></i>Loan Request Details
            </h6>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-3" style={{ color: '#000', maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="mb-3">
              <h6 className="fw-bold mb-2" style={{ color: '#4066df', fontSize: '0.95rem' }}>
                <i className="bi bi-person-circle me-2"></i>Request From:
              </h6>
              <div
                style={{
                  background: '#fff',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #dee2e6',
                  fontSize: '0.9rem',
                }}
              >
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <strong style={{ fontSize: '0.85rem' }}>Name:</strong>{' '}
                    <span>{senderProfile.name || 'Not provided'}</span>
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong style={{ fontSize: '0.85rem' }}>Username:</strong>{' '}
                    <span>{senderProfile.username || 'Not provided'}</span>
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong style={{ fontSize: '0.85rem' }}>Email:</strong>{' '}
                    <span style={{ fontSize: '0.85rem', wordBreak: 'break-word' }}>{senderProfile.email || 'Not provided'}</span>
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong style={{ fontSize: '0.85rem' }}>Mobile:</strong>{' '}
                    <span>{senderProfile.mobilenumber || 'Not provided'}</span>
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong style={{ fontSize: '0.85rem' }}>City:</strong>{' '}
                    <span>{senderProfile.city || 'Not provided'}</span>
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong style={{ fontSize: '0.85rem' }}>State:</strong>{' '}
                    <span>{senderProfile.state || 'Not provided'}</span>
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong style={{ fontSize: '0.85rem' }}>Country:</strong>{' '}
                    <span>{senderProfile.country || 'Not provided'}</span>
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong style={{ fontSize: '0.85rem' }}>Pin Code:</strong>{' '}
                    <span>{senderProfile.pinCode || 'Not provided'}</span>
                  </div>
                  {senderProfile.aadharNumber && (
                    <div className="col-md-6 mb-2">
                      <strong style={{ fontSize: '0.85rem' }}>Aadhar Number:</strong>{' '}
                      <span>{senderProfile.aadharNumber}</span>
                    </div>
                  )}
                  {senderProfile.panCardNumber && (
                    <div className="col-md-6 mb-2">
                      <strong style={{ fontSize: '0.85rem' }}>PAN Card Number:</strong>{' '}
                      <span>{senderProfile.panCardNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <h6 className="fw-bold mb-2" style={{ color: '#4066df', fontSize: '0.95rem' }}>
                <i className="bi bi-chat-left-text me-2"></i>Message:
              </h6>
              <div
                style={{
                  background: '#fff',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #dee2e6',
                  fontSize: '0.9rem',
                }}
              >
                {notification.message || 'No message provided'}
              </div>
            </div>

            <div className="mb-3" style={{ fontSize: '0.85rem' }}>
              <strong>Requested on:</strong>{' '}
              <span>{formatDate(notification.timestamp)}</span>
            </div>

            <div className="alert alert-info mb-0 py-2" role="alert" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-info-circle me-2"></i>
              Please review the borrower's details before accepting or rejecting this loan request.
            </div>
          </div>
          <div
            className="modal-footer border-0 p-3"
            style={{ background: '#f8f9fa', borderRadius: '0 0 15px 15px' }}
          >
            <button
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              disabled={loading}
              style={{ borderRadius: '10px', fontSize: '0.9rem' }}
            >
              Close
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleRespond('rejected')}
              disabled={loading}
              style={{ borderRadius: '10px', fontSize: '0.9rem' }}
            >
              {loading && action === 'rejected' ? (
                <>
                  <ClipLoader color="#fff" size={14} className="me-2" />
                  Rejecting...
                </>
              ) : (
                <>
                  <i className="bi bi-x-circle me-2"></i>Reject
                </>
              )}
            </button>
            <button
              className="btn btn-success btn-sm"
              onClick={() => handleRespond('accepted')}
              disabled={loading}
              style={{ borderRadius: '10px', fontSize: '0.9rem' }}
            >
              {loading && action === 'accepted' ? (
                <>
                  <ClipLoader color="#fff" size={14} className="me-2" />
                  Accepting...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>Accept
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;

