import React, { useState, useEffect, useContext } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ClipLoader } from 'react-spinners';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chat from './Chatting'; // from second component
import LoanConsentModal from './LoanConsentModal';
import MainContext from '../Context/mainContext';

const Postcard = ({ post, EditTheAlert }) => {
  const context = useContext(MainContext);
  const { sendNotification } = context;
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const userId = localStorage.getItem('userId');
  const senderId = userId;
  const receiverId = post.userId?._id || post.userId;

  const postDate = new Date(post.fromDate);
  const day = postDate.getDate();
  const month = postDate.toLocaleString('default', { month: 'long' });
  const year = postDate.getFullYear();
  const hours = postDate.getHours().toString().padStart(2, '0');
  const minutes = postDate.getMinutes().toString().padStart(2, '0');
  const readableDate = `${day} ${month} ${year}, ${hours}:${minutes}`;

  useEffect(() => {
    AOS.init({ duration: 1000 });
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const handleOpenChat = () => {
    if (!localStorage.getItem('Authtoken')) {
      EditTheAlert('Error', 'Please log in to start a chat.');
      return;
    }
    if (!post.userId?._id) {
      EditTheAlert('Error', 'Cannot start chat: Post owner not found.');
      return;
    }
    setShowChat(true);
  };

  const handleTakeLoan = async () => {
    if (!localStorage.getItem('Authtoken')) {
      EditTheAlert('Error', 'Please log in to take a loan.');
      return;
    }
    if (userId === (post.userId?._id || post.userId)) {
      EditTheAlert('Error', 'You cannot take your own loan.');
      return;
    }
    
    // Call send notification API
    setSendingRequest(true);
    try {
      const result = await sendNotification(receiverId, `Loan request for ₹${post.money.toLocaleString()}`);
      if (result.success) {
        EditTheAlert('Success', 'Loan request sent successfully!');
      } else {
        EditTheAlert('Error', result.error || 'Failed to send loan request.');
      }
    } catch (error) {
      console.error('Error sending loan request:', error);
      EditTheAlert('Error', 'An error occurred while sending the loan request.');
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <div className="col-md-4 mb-4">
      {isLoading && (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <ClipLoader color="#4066df" size={50} />
        </div>
      )}
      <div
        className={`card text-white ${isLoading ? 'd-none' : ''}`}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          border: '2px solid #000',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
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
        data-aos="fade-up"
      >
        <div
          className="card-header d-flex align-items-center"
          style={{
            background: 'linear-gradient(135deg, #8456ce, #4066df)',
            color: '#1e1e2f',
            borderRadius: '20px 20px 0 0',
            padding: '1rem',
          }}
        >
          <img
            src={'quickmoney.jpg'}
            alt={`${post.userId?.name || 'Anonymous'}'s profile`}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              marginRight: '10px',
              objectFit: 'cover',
              border: '2px solid #fff',
            }}
          />
          <span className="fw-bold" style={{ fontSize: '1.1rem' }}>
            {post.userId?.name || 'Anonymous'}
          </span>
        </div>
        <div className="card-body p-3">
          <h5 className="card-title mb-2" style={{ color: '#4066df', fontWeight: 'bold' }}>
            {post.tittle}
          </h5>
          <h4 className="mb-3" style={{ color: '#000', fontWeight: 'bold' }}>
            ₹{post.money.toLocaleString()}
          </h4>
          <p className="card-text mb-2" style={{ fontSize: '0.9rem', color: '#000', fontWeight: '600' }}>
            <i className="bi bi-percent me-2"></i>
            Interest Rate: {post.description}% per month
          </p>
          <p className="card-text mb-2" style={{ fontSize: '0.9rem', color: '#000', fontWeight: '600' }}>
            <i className="bi bi-telephone-fill me-2"></i>
            Contact: {post.mobilenumber}
          </p>
          {/* Location Information */}
          {(post.userId?.city || post.userId?.state || post.userId?.country) && (
            <div className="mb-2" style={{ 
              padding: '0.5rem', 
              background: 'rgba(132, 86, 206, 0.1)', 
              borderRadius: '8px',
              border: '1px solid rgba(132, 86, 206, 0.3)'
            }}>
              <p className="card-text mb-1" style={{ fontSize: '0.85rem', color: '#4066df', fontWeight: 'bold', marginBottom: '4px' }}>
                <i className="bi bi-geo-alt-fill me-2"></i>
                Location:
              </p>
              <div style={{ paddingLeft: '1.2rem' }}>
                {post.userId?.city && (
                  <p className="card-text mb-1" style={{ fontSize: '0.85rem', color: '#000', margin: '2px 0' }}>
                    <i className="bi bi-building me-2" style={{ fontSize: '0.75rem' }}></i>
                    City: <strong style={{ color: '#000' }}>{post.userId.city}</strong>
                  </p>
                )}
                {post.userId?.state && (
                  <p className="card-text mb-1" style={{ fontSize: '0.85rem', color: '#000', margin: '2px 0' }}>
                    <i className="bi bi-map me-2" style={{ fontSize: '0.75rem' }}></i>
                    State: <strong style={{ color: '#000' }}>{post.userId.state}</strong>
                  </p>
                )}
                {post.userId?.country && (
                  <p className="card-text mb-1" style={{ fontSize: '0.85rem', color: '#000', margin: '2px 0' }}>
                    <i className="bi bi-globe me-2" style={{ fontSize: '0.75rem' }}></i>
                    Country: <strong style={{ color: '#000' }}>{post.userId.country}</strong>
                  </p>
                )}
                {post.userId?.pinCode && (
                  <p className="card-text mb-0" style={{ fontSize: '0.85rem', color: '#000', margin: '2px 0' }}>
                    <i className="bi bi-pin-map-fill me-2" style={{ fontSize: '0.75rem' }}></i>
                    Pin Code: <strong style={{ color: '#000' }}>{post.userId.pinCode}</strong>
                  </p>
                )}
              </div>
            </div>
          )}
          <p className="card-text" style={{ fontSize: '0.85rem', color: '#000' }}>
            <i className="bi bi-calendar-event me-2"></i>
            Posted: {readableDate}
          </p>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center border-0" style={{ background: 'rgba(0, 0, 0, 0.1)', padding: '1rem' }}>
          {/* Only show Message button if post doesn't belong to current user */}
          {userId !== (post.userId?._id || post.userId) && (
            <button
              className="btn btn-sm btn-warning"
              onClick={handleOpenChat}
              style={{ borderRadius: '10px', padding: '6px 15px' }}
            >
              <i className="bi bi-chat-dots me-1"></i> Message
            </button>
          )}
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => EditTheAlert('Info', 'More details coming soon!')}
            style={{ borderRadius: '10px', padding: '6px 15px', color: '#000', borderColor: '#000' }}
          >
            <i className="bi bi-info-circle me-1"></i> Details
          </button>
          <button
            className="btn btn-sm btn-success"
            onClick={handleTakeLoan}
            disabled={sendingRequest}
            style={{ borderRadius: '10px', padding: '6px 15px' }}
          >
            {sendingRequest ? (
              <>
                <ClipLoader color="#fff" size={12} /> Sending...
              </>
            ) : (
              <>
                <i className="bi bi-wallet2 me-1"></i> Take Loan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Chat popup using compact Chat modal from second component */}
      {showChat && (
        <div className="chat-modal" style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          width: '350px',
          transition: 'all 0.3s ease',
        }}>
          <Chat 
            senderId={senderId}
            receiverId={receiverId}
            receiverName={post.userId?.name || 'Partner'}
            onClose={() => setShowChat(false)}
          />
        </div>
      )}

      {/* Loan Consent Modal */}
      {showConsentModal && (
        <LoanConsentModal
          post={post}
          borrowerId={userId}
          lenderId={post.userId._id}
          onClose={() => setShowConsentModal(false)}
          EditTheAlert={EditTheAlert}
        />
      )}
    </div>
  );
};

export default Postcard;


// const userdata = localStorage.getItem('userId')
// try {

//   let response = await fetch(`https://backendofquickmoney.onrender.com/api/auth/GetUserData/${userdata}`, {
//     method: 'GET', 

//     headers: {
//       'Content-Type': 'application/json', 
//     }
//   });