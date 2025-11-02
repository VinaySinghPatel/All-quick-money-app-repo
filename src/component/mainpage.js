import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import mainContext from '../Context/mainContext';
import Postcard from './postcard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHandHoldingUsd, FaUsers, FaShieldAlt, FaUserCircle, FaArrowRight, FaGithub, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { HiCurrencyRupee, HiLockClosed } from 'react-icons/hi2';
import { MdAccountCircle, MdSecurity, MdMoney, MdChatBubbleOutline } from 'react-icons/md';
import { IoWallet, IoChatbubbles, IoPerson } from 'react-icons/io5';

const HomePage = (props) => {
  const context = useContext(mainContext);
  const { GetAllPost, Posts } = context;

  useEffect(() => {
    GetAllPost();
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div style={{ 
      background: 'transparent',
      minHeight: '100vh', 
      color: '#000',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(64, 102, 223, 0.1) 0%, transparent 70%)',
        animation: 'float 20s ease-in-out infinite',
        pointerEvents: 'none'
      }}></div>
      
      {/* Hero Section */}
      <section className="container-fluid px-4 px-md-5 py-5 text-center" data-aos="fade-up" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '60px' }}>
          <h1 className="display-3 fw-bold mb-4" style={{ 
            color: '#000', 
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                background: 'linear-gradient(135deg, #000 0%, #4066df 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)'
          }}>
            Welcome to Quick Money
          </h1>
          <p className="lead my-4" style={{ 
            fontSize: '1.4rem',
            color: 'rgba(0, 0, 0, 0.9)',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            fontWeight: '300'
          }}>
            Connect, lend, and borrow with ease in our secure peer-to-peer platform.
          </p>
          <div className="mt-5">
            {!localStorage.getItem('Authtoken') ? (
              <>
                <Link 
                  to="/Login" 
                  className="btn btn-lg mx-2 mb-2 mb-md-0"
                  style={{ 
                    background: 'linear-gradient(135deg, #ff6b6b, #c33d69)',
                    color: '#1e1e2f',
                    border: 'none',
                    borderRadius: '50px',
                    padding: '15px 40px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 107, 107, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)';
                  }}
                >
                  Login
                </Link>
                <Link 
                  to="/SignUp" 
                  className="btn btn-lg mx-2"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: '#000',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    borderRadius: '50px',
                    padding: '15px 40px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  }}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link 
                to="/NewPost" 
                className="btn btn-lg"
                style={{ 
                    background: 'linear-gradient(135deg, #8456ce, #4066df)',
                  color: '#1e1e2f',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '15px 40px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)';
                }}
              >
                Create a Loan Post
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-fluid px-4 px-md-5 py-5" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 className="text-center mb-5" style={{ 
            color: '#000', 
            fontSize: '2.5rem',
            fontWeight: '700',
            textShadow: '0 2px 15px rgba(0,0,0,0.2)'
          }} data-aos="fade-up">
            Why Choose Quick Money?
          </h2>
          <div className="row g-4">
            {/* Peer-to-Peer Lending Card */}
            <div className="col-md-4 mb-4" data-aos="fade-right">
              <div 
                className="card text-white h-100 border-0 position-relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.25) 0%, rgba(195, 61, 105, 0.25) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  boxShadow: '0 12px 40px rgba(255, 107, 107, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  border: '2px solid #000',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(255, 107, 107, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.borderColor = '#000';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.35) 0%, rgba(195, 61, 105, 0.35) 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 107, 107, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.borderColor = '#000';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.25) 0%, rgba(195, 61, 105, 0.25) 100%)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(255, 107, 107, 0.1) 0%, transparent 70%)',
                  animation: 'cardFloat 6s ease-in-out infinite'
                }}></div>
                {/* Floating decorative icons */}
                <FaUsers style={{
                  position: 'absolute',
                  top: '15%',
                  left: '10%',
                  fontSize: '2rem',
                  color: 'rgba(255, 107, 107, 0.2)',
                  animation: 'iconFloat 4s ease-in-out infinite',
                  zIndex: 0
                }} />
                <HiCurrencyRupee style={{
                  position: 'absolute',
                  bottom: '20%',
                  right: '15%',
                  fontSize: '1.5rem',
                  color: 'rgba(255, 107, 107, 0.25)',
                  animation: 'iconFloat 5s ease-in-out infinite 1s',
                  zIndex: 0
                }} />
                <div className="card-body text-center p-5 position-relative" style={{ zIndex: 1 }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 25px',
                    background: 'linear-gradient(135deg, #ff6b6b, #c33d69)',
                    borderRadius: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: '0 8px 24px rgba(132, 86, 206, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotate(5deg) scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(132, 86, 206, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'rotate(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(132, 86, 206, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)';
                  }}
                  >
                    <FaHandHoldingUsd style={{ fontSize: '3.5rem', color: '#1e1e2f' }} />
                    {/* Small decorative square-rounded ring */}
                    <div style={{
                      position: 'absolute',
                      width: '140px',
                      height: '140px',
                      border: '3px solid rgba(255, 107, 107, 0.3)',
                      borderRadius: '35px',
                      top: '-10px',
                      left: '-10px',
                      animation: 'rotateRing 8s linear infinite'
                    }}></div>
                  </div>
                  <h5 className="card-title mb-4" style={{ 
                    fontSize: '1.6rem', 
                    fontWeight: '700',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}>
                    Peer-to-Peer Lending
                    <FaArrowRight style={{ fontSize: '1.2rem', opacity: 0.7 }} />
                  </h5>
                  <p className="card-text" style={{ 
                    fontSize: '1.1rem', 
                    lineHeight: '1.8',
                    color: 'rgba(0, 0, 0, 0.9)',
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    Post or browse loan offers with competitive interest rates directly from users.
                  </p>
                  {/* Decorative money icon at bottom */}
                  <MdMoney style={{
                    position: 'absolute',
                    bottom: '15px',
                    right: '20px',
                    fontSize: '1.8rem',
                    color: 'rgba(255, 107, 107, 0.3)',
                    animation: 'iconPulse 3s ease-in-out infinite'
                  }} />
                </div>
              </div>
            </div>

            {/* Secure Chat Card */}
            <div className="col-md-4 mb-4" data-aos="fade-up">
              <div 
                className="card text-white h-100 border-0 position-relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(118, 75, 162, 0.3) 0%, rgba(102, 126, 234, 0.3) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  boxShadow: '0 12px 40px rgba(118, 75, 162, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  border: '2px solid #000',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(118, 75, 162, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.borderColor = '#000';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(118, 75, 162, 0.4) 0%, rgba(102, 126, 234, 0.4) 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(118, 75, 162, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.borderColor = '#000';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(118, 75, 162, 0.3) 0%, rgba(102, 126, 234, 0.3) 100%)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)',
                  animation: 'cardFloat 8s ease-in-out infinite'
                }}></div>
                {/* Floating decorative icons */}
                <MdChatBubbleOutline style={{
                  position: 'absolute',
                  top: '20%',
                  right: '12%',
                  fontSize: '2.2rem',
                  color: 'rgba(118, 75, 162, 0.25)',
                  animation: 'iconFloat 5s ease-in-out infinite 0.5s',
                  zIndex: 0
                }} />
                <HiLockClosed style={{
                  position: 'absolute',
                  bottom: '25%',
                  left: '12%',
                  fontSize: '1.8rem',
                  color: 'rgba(102, 126, 234, 0.3)',
                  animation: 'iconFloat 4s ease-in-out infinite 1.5s',
                  zIndex: 0
                }} />
                <div className="card-body text-center p-5 position-relative" style={{ zIndex: 1 }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 25px',
                    background: 'linear-gradient(135deg, #764BA2, #667EEA)',
                    borderRadius: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: '0 8px 24px rgba(118, 75, 162, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotate(-5deg) scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(118, 75, 162, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'rotate(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(118, 75, 162, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)';
                  }}
                  >
                    <FaShieldAlt style={{ fontSize: '3.5rem', color: '#000000' }} />
                    {/* Shield pattern overlay */}
                    <div style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                      borderRadius: '30px'
                    }}></div>
                  </div>
                  <h5 className="card-title mb-4" style={{ 
                    fontSize: '1.6rem', 
                    fontWeight: '700',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}>
                    Secure Chat
                    <FaArrowRight style={{ fontSize: '1.2rem', opacity: 0.7 }} />
                  </h5>
                  <p className="card-text" style={{ 
                    fontSize: '1.1rem', 
                    lineHeight: '1.8',
                    color: 'rgba(0, 0, 0, 0.9)',
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    Communicate securely with other users to discuss loan terms.
                  </p>
                  {/* Decorative chat bubbles */}
                  <IoChatbubbles style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '20px',
                    fontSize: '1.8rem',
                    color: 'rgba(118, 75, 162, 0.3)',
                    animation: 'iconPulse 3s ease-in-out infinite 1s'
                  }} />
                </div>
              </div>
            </div>

            {/* User Profiles Card */}
            <div className="col-md-4 mb-4" data-aos="fade-left">
              <div 
                className="card text-white h-100 border-0 position-relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(46, 165, 151, 0.3) 0%, rgba(31, 129, 4, 0.3) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  boxShadow: '0 12px 40px rgba(46, 165, 151, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  border: '2px solid #000',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-15px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(46, 165, 151, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.borderColor = '#000';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(46, 165, 151, 0.4) 0%, rgba(31, 129, 4, 0.4) 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(46, 165, 151, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.borderColor = '#000';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(46, 165, 151, 0.3) 0%, rgba(31, 129, 4, 0.3) 100%)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  bottom: '-50%',
                  right: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(46, 165, 151, 0.15) 0%, transparent 70%)',
                  animation: 'cardFloat 7s ease-in-out infinite'
                }}></div>
                {/* Floating decorative icons */}
                <MdAccountCircle style={{
                  position: 'absolute',
                  top: '18%',
                  left: '15%',
                  fontSize: '2rem',
                  color: 'rgba(46, 165, 151, 0.25)',
                  animation: 'iconFloat 6s ease-in-out infinite',
                  zIndex: 0
                }} />
                <IoPerson style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10%',
                  fontSize: '1.6rem',
                  color: 'rgba(31, 129, 4, 0.3)',
                  animation: 'iconFloat 5s ease-in-out infinite 1s',
                  zIndex: 0
                }} />
                <div className="card-body text-center p-5 position-relative" style={{ zIndex: 1 }}>
                  <div style={{
                    width: '120px',
                    height: '120px',
                    margin: '0 auto 25px',
                    background: 'linear-gradient(135deg, #2EA597, #1F8104)',
                    borderRadius: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: '0 8px 24px rgba(46, 165, 151, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotate(5deg) scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(46, 165, 151, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'rotate(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(46, 165, 151, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)';
                  }}
                  >
                    <FaUserCircle style={{ fontSize: '3.5rem', color: '#000000' }} />
                    {/* Profile badge decoration */}
                    <div style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      width: '35px',
                      height: '35px',
                      background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(46, 165, 151, 0.4)',
                      animation: 'badgePulse 2s ease-in-out infinite'
                    }}>
                      <MdSecurity style={{ fontSize: '1.2rem', color: '#2EA597' }} />
                    </div>
                  </div>
                  <h5 className="card-title mb-4" style={{ 
                    fontSize: '1.6rem', 
                    fontWeight: '700',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}>
                    User Profiles
                    <FaArrowRight style={{ fontSize: '1.2rem', opacity: 0.7 }} />
                  </h5>
                  <p className="card-text" style={{ 
                    fontSize: '1.1rem', 
                    lineHeight: '1.8',
                    color: 'rgba(0, 0, 0, 0.9)',
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    Manage your posts and profile with ease and security.
                  </p>
                  {/* Decorative wallet icon */}
                  <IoWallet style={{
                    position: 'absolute',
                    bottom: '15px',
                    right: '20px',
                    fontSize: '1.8rem',
                    color: 'rgba(46, 165, 151, 0.3)',
                    animation: 'iconPulse 3s ease-in-out infinite 0.5s'
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Preview Section */}
      <section className="container-fluid px-4 px-md-5 py-5" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h2 className="text-center mb-5" style={{ 
            color: '#000', 
            fontSize: '2.5rem',
            fontWeight: '700',
            textShadow: '0 2px 15px rgba(0,0,0,0.2)'
          }} data-aos="fade-up">
            Recent Loan Posts
          </h2>
          <div className="row g-4">
            {Array.isArray(Posts) && Posts.length === 0 && (
              <div className="text-center col-12" style={{ fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.8)' }}>
                Please Wait Some Seconds, Loading...
              </div>
            )}
            {Array.isArray(Posts) &&
              Posts.slice(0, 3) // Show only 3 posts for preview
                .sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate))
                .map((record) => (
                  <Postcard
                    key={record._id}
                    EditTheAlert={props.EditTheAlert}
                    post={record}
                  />
                ))}
          </div>
          <div className="text-center mt-5" data-aos="fade-up">
            <Link 
              to="/allposts" 
              className="btn btn-lg"
              style={{ 
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#000',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '50px',
                padding: '12px 35px',
                fontSize: '1.1rem',
                fontWeight: '600',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
            >
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer 
        className="py-5"
        style={{ 
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.25) 0%, rgba(64, 102, 223, 0.15) 100%)',
          backdropFilter: 'blur(20px)',
          borderTop: '2px solid rgba(64, 102, 223, 0.2)',
          position: 'relative',
          zIndex: 1,
          marginTop: '60px'
        }}
        data-aos="fade-up"
      >
        <div className="container-fluid px-4 px-md-5">
          <div className="row g-4">
            {/* Brand Section */}
            <div className="col-md-4 mb-4 mb-md-0">
              <h4 
                className="mb-4"
                style={{ 
                  color: '#000',
                  fontWeight: '700',
                  fontSize: '1.8rem',
                  background: 'linear-gradient(135deg, #000 0%, #4066df 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Quick Money
              </h4>
              <p style={{ 
                color: 'rgba(0, 0, 0, 0.8)', 
                fontSize: '1rem',
                lineHeight: '1.8',
                marginBottom: '1.5rem'
              }}>
                Connect, lend, and borrow with ease in our secure peer-to-peer lending platform. 
                Empowering financial freedom through trusted community connections.
              </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-start' }}>
                <a 
                  href="https://github.com/VinaySinghPatel" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(64, 102, 223, 0.2), rgba(132, 86, 206, 0.2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4066df',
                    fontSize: '1.3rem',
                    textDecoration: 'none',
                    border: '2px solid rgba(64, 102, 223, 0.3)',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #4066df, #8456ce)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(64, 102, 223, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(64, 102, 223, 0.2), rgba(132, 86, 206, 0.2))';
                    e.currentTarget.style.color = '#4066df';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FaGithub />
                </a>
                <a 
                  href="https://www.instagram.com/singh_vinay_patel/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(195, 61, 105, 0.2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ff6b6b',
                    fontSize: '1.3rem',
                    textDecoration: 'none',
                    border: '2px solid rgba(255, 107, 107, 0.3)',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ff6b6b, #c33d69)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 107, 107, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(195, 61, 105, 0.2))';
                    e.currentTarget.style.color = '#ff6b6b';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FaInstagram />
                </a>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="col-md-2 mb-4 mb-md-0">
              <h5 
                className="mb-4"
                style={{ 
                  color: '#000',
                  fontWeight: '600',
                  fontSize: '1.3rem',
                  marginBottom: '1.5rem'
                }}
              >
                Quick Links
              </h5>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li className="mb-3">
                  <Link 
                    to="/allposts" 
                    style={{ 
                      color: 'rgba(0, 0, 0, 0.8)',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: '2px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#000';
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.borderColor = '#000';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(0, 0, 0, 0.8)';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <FaArrowRight style={{ fontSize: '0.8rem' }} />
                    All Posts
                  </Link>
                </li>
                <li className="mb-3">
                  {localStorage.getItem('Authtoken') ? (
                    <Link 
                      to="/NewPost" 
                      style={{ 
                        color: 'rgba(0, 0, 0, 0.8)',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: '2px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#000';
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.borderColor = '#000';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(0, 0, 0, 0.8)';
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <FaArrowRight style={{ fontSize: '0.8rem' }} />
                      Create Post
                    </Link>
                  ) : (
                    <Link 
                      to="/Login" 
                      style={{ 
                        color: 'rgba(0, 0, 0, 0.8)',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#4066df';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(0, 0, 0, 0.8)';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <FaArrowRight style={{ fontSize: '0.8rem' }} />
                      Login
                    </Link>
                  )}
                </li>
                <li className="mb-3">
                  <Link 
                    to="/visit" 
                    style={{ 
                      color: 'rgba(0, 0, 0, 0.8)',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: '2px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#000';
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.borderColor = '#000';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(0, 0, 0, 0.8)';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <FaArrowRight style={{ fontSize: '0.8rem' }} />
                    About Us
                  </Link>
                </li>
                {localStorage.getItem('Authtoken') && (
                  <li className="mb-3">
                    <Link 
                      to="/Profile" 
                      style={{ 
                        color: 'rgba(0, 0, 0, 0.8)',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'transparent',
                        border: '2px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#000';
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.borderColor = '#000';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'rgba(0, 0, 0, 0.8)';
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <FaArrowRight style={{ fontSize: '0.8rem' }} />
                      My Profile
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Contact Section */}
            <div className="col-md-3 mb-4 mb-md-0">
              <h5 
                className="mb-4"
                style={{ 
                  color: '#000',
                  fontWeight: '600',
                  fontSize: '1.3rem',
                  marginBottom: '1.5rem'
                }}
              >
                Get In Touch
              </h5>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(64, 102, 223, 0.2), rgba(132, 86, 206, 0.2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4066df',
                    fontSize: '1.1rem',
                    border: '2px solid rgba(64, 102, 223, 0.3)'
                  }}>
                    <FaEnvelope />
                  </div>
                  <div>
                    <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.9rem' }}>Email</p>
                    <p style={{ margin: 0, color: '#000', fontSize: '0.95rem', fontWeight: '500' }}>vinaypatel898944@gmail.com</p>
                  </div>
                </li>
                <li className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(46, 165, 151, 0.2), rgba(31, 129, 4, 0.2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2EA597',
                    fontSize: '1.1rem',
                    border: '2px solid rgba(46, 165, 151, 0.3)'
                  }}>
                    <FaPhone />
                  </div>
                  <div>
                    <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.9rem' }}>Phone</p>
                    <p style={{ margin: 0, color: '#000', fontSize: '0.95rem', fontWeight: '500' }}>+91 8770686758</p>
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(195, 61, 105, 0.2))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ff6b6b',
                    fontSize: '1.1rem',
                    border: '2px solid rgba(255, 107, 107, 0.3)'
                  }}>
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p style={{ margin: 0, color: 'rgba(0, 0, 0, 0.7)', fontSize: '0.9rem' }}>Location</p>
                    <p style={{ margin: 0, color: '#000', fontSize: '0.95rem', fontWeight: '500' }}>India</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Services Section */}
            <div className="col-md-3">
              <h5 
                className="mb-4"
                style={{ 
                  color: '#000',
                  fontWeight: '600',
                  fontSize: '1.3rem',
                  marginBottom: '1.5rem'
                }}
              >
                Our Services
              </h5>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li className="mb-2" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '1rem' }}>
                  <FaShieldAlt style={{ color: '#4066df', marginRight: '8px', fontSize: '0.9rem' }} />
                  Secure Lending
                </li>
                <li className="mb-2" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '1rem' }}>
                  <IoChatbubbles style={{ color: '#8456ce', marginRight: '8px', fontSize: '1rem' }} />
                  Direct Chat
                </li>
                <li className="mb-2" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '1rem' }}>
                  <FaUsers style={{ color: '#2EA597', marginRight: '8px', fontSize: '0.9rem' }} />
                  Peer-to-Peer
                </li>
                <li className="mb-2" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '1rem' }}>
                  <MdSecurity style={{ color: '#ff6b6b', marginRight: '8px', fontSize: '1rem' }} />
                  Safe Transactions
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <hr style={{ 
            border: 'none',
            borderTop: '1px solid rgba(64, 102, 223, 0.2)',
            margin: '2.5rem 0 1.5rem 0'
          }} />
          <div className="row">
            <div className="col-12 text-center">
              <p style={{ 
                color: 'rgba(0, 0, 0, 0.7)', 
                fontSize: '0.95rem',
                margin: 0,
                fontWeight: '500'
              }}>
                © {new Date().getFullYear()} <span style={{ color: '#4066df', fontWeight: '600' }}>Quick Money</span>. All Rights Reserved.
              </p>
              <p style={{ 
                color: 'rgba(0, 0, 0, 0.6)', 
                fontSize: '0.85rem',
                margin: '0.5rem 0 0 0'
              }}>
                Made with ❤️ for secure peer-to-peer lending
              </p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }
        @keyframes cardFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(20px, 20px) scale(1.1);
            opacity: 0.5;
          }
        }
        @keyframes iconFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          33% {
            transform: translateY(-10px) translateX(5px);
            opacity: 0.4;
          }
          66% {
            transform: translateY(5px) translateX(-5px);
            opacity: 0.35;
          }
        }
        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.5;
          }
        }
        @keyframes rotateRing {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes badgePulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 12px rgba(46, 165, 151, 0.4);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(46, 165, 151, 0.6);
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;