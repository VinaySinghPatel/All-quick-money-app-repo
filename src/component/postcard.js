import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ClipLoader } from 'react-spinners';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chat from './Chatting'; // from second component
import LoanConsentModal from './LoanConsentModal';

const Postcard = ({ post, EditTheAlert }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
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

  const handleTakeLoan = () => {
    if (!localStorage.getItem('Authtoken')) {
      EditTheAlert('Error', 'Please log in to take a loan.');
      return;
    }
    if (userId === post.userId._id) {
      EditTheAlert('Error', 'You cannot take your own loan.');
      return;
    }
    setShowConsentModal(true);
  };

  return (
    <div className="col-md-4 mb-4">
      {isLoading && (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <ClipLoader color="#FFD700" size={50} />
        </div>
      )}
      <div
        className={`card text-white ${isLoading ? 'd-none' : ''}`}
        style={{
          background: 'linear-gradient(135deg, #1e1e2f, #2a2a3d)',
          border: 'none',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
        }}
        data-aos="fade-up"
      >
        <div
          className="card-header d-flex align-items-center"
          style={{
            background: 'linear-gradient(90deg, #FFD700, #FFC107)',
            color: '#1e1e2f',
            borderRadius: '15px 15px 0 0',
            padding: '0.75rem 1rem',
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
          <h5 className="card-title mb-2" style={{ color: '#FFD700', fontWeight: 'bold' }}>
            {post.tittle}
          </h5>
          <h4 className="mb-3" style={{ color: '#fff', fontWeight: 'bold' }}>
            ₹{post.money.toLocaleString()}
          </h4>
          <p className="card-text mb-2" style={{ fontSize: '0.9rem', color: '#dcdcdc' }}>
            <i className="bi bi-percent me-2"></i>
            Interest Rate: {post.description}% per month
          </p>
          <p className="card-text mb-2" style={{ fontSize: '0.9rem', color: '#dcdcdc' }}>
            <i className="bi bi-telephone-fill me-2"></i>
            Contact: {post.mobilenumber}
          </p>
          <p className="card-text" style={{ fontSize: '0.85rem', color: '#aaaaaa' }}>
            <i className="bi bi-calendar-event me-2"></i>
            Posted: {readableDate}
          </p>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center border-0" style={{ background: '#2a2a3d', padding: '1rem' }}>
          <button
            className="btn btn-sm btn-warning"
            onClick={handleOpenChat}
            style={{ borderRadius: '10px', padding: '6px 15px' }}
          >
            <i className="bi bi-chat-dots me-1"></i> Message
          </button>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => EditTheAlert('Info', 'More details coming soon!')}
            style={{ borderRadius: '10px', padding: '6px 15px' }}
          >
            <i className="bi bi-info-circle me-1"></i> Details
          </button>
          <button
            className="btn btn-sm btn-success"
            onClick={handleTakeLoan}
            style={{ borderRadius: '10px', padding: '6px 15px' }}
          >
            <i className="bi bi-wallet2 me-1"></i> Take Loan
          </button>
        </div>
      </div>

      {/* Chat popup using compact Chat modal from second component */}
      {showChat && (
        <div className="chat-modal" style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          width: '350px',
          transition: 'all 0.3s ease',
        }}>
          <Chat 
            senderId={senderId}
            receiverId={receiverId}
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