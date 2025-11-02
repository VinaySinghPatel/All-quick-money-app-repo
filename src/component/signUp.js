import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ClipLoader } from 'react-spinners';
import API_BASE_URL from '../config/api';

const SignUp = ({ EditTheAlert }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    aadhaar: '',
    pan: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    profileImage: null,
  });

  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateAadhaar = (aadhaar) => /^[0-9]{12}$/.test(aadhaar);
  const validatePAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, mobileNumber, aadhaar, pan, city, state, country, pinCode, profileImage } = formData;

    if (!name || !email || !password || !confirmPassword || !mobileNumber || !aadhaar || !pan || !city || !state || !country || !pinCode) {
      EditTheAlert('Error', 'All fields are required.');
      return;
    }
    
    // Validate mobile number
    if (mobileNumber.length !== 10 || !/^[0-9]{10}$/.test(mobileNumber)) {
      EditTheAlert('Error', 'Mobile number must be 10 digits.');
      return;
    }
    
    // Validate pin code
    if (pinCode.length !== 6 || !/^[0-9]{6}$/.test(pinCode)) {
      EditTheAlert('Error', 'Pin code must be 6 digits.');
      return;
    }
    if (!validateAadhaar(aadhaar)) {
      EditTheAlert('Error', 'Aadhaar number must be 12 digits.');
      return;
    }
    if (!validatePAN(pan)) {
      EditTheAlert('Error', 'PAN must be valid format (e.g., ABCDE1234F).');
      return;
    }
    if (password !== confirmPassword) {
      EditTheAlert('Error', 'Passwords do not match.');
      return;
    }
    if (!consent) {
      EditTheAlert('Error', 'You must consent to data storage.');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', name);
      data.append('email', email);
      data.append('password', password);
      data.append('mobilenumber', mobileNumber);
      data.append('aadharNumber', aadhaar);
      data.append('panCardNumber', pan);
      data.append('city', city);
      data.append('state', state);
      data.append('country', country);
      data.append('pinCode', pinCode);
      if (profileImage) data.append('profileImage', profileImage);

      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        body: data,
      });

      const resData = await response.json();
      if (resData.success) {
        EditTheAlert('Success', 'Sign-up successful! Please verify your email.');
        navigate('/login');
      } else {
        EditTheAlert('Error', resData.error || 'Sign-up failed.');
      }
    } catch (err) {
      console.error('Sign-up error:', err);
      EditTheAlert('Error', 'An error occurred during sign-up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        background: 'transparent',
        minHeight: '100vh',
        padding: '15px',
        margin: '0',
        color: '#000',
        width: '100%',
        overflowY: 'auto'
      }}
    >
      <div className="card signup-card" style={{
        background: 'transparent',
        backdropFilter: 'blur(10px)',
        border: '2px solid #000',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '500px',
        padding: '24px',
        margin: 'auto'
      }} data-aos="fade-up">
        <div className="text-center mb-4">
          <h2 className="mb-0 fw-bold" style={{ fontSize: '22px', marginBottom: '6px', color: '#000' }}>
            Create your account
          </h2>
            <p className="mb-0" style={{ color: '#000', fontSize: '13px', marginTop: '6px' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#667eea', textDecoration: 'none' }}>Sign in</a>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="name" className="form-label mb-1" style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        color: '#000',
                        padding: '10px 12px',
                        fontSize: '14px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="email" className="form-label mb-1" style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        color: '#000',
                        padding: '10px 12px',
                        fontSize: '14px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label htmlFor="mobileNumber" className="form-label mb-1" style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="9876543210"
                    maxLength="10"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      color: '#000',
                      padding: '10px 12px',
                      fontSize: '14px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="password" className="form-label mb-1" style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>
                      Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(0, 0, 0, 0.3)',
                          borderRadius: '8px',
                          color: '#000',
                          padding: '10px 45px 10px 12px',
                          fontSize: '14px',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          color: '#000',
                          cursor: 'pointer',
                          padding: '5px',
                          fontSize: '16px'
                        }}
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="confirmPassword" className="form-label mb-1" style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>
                      Confirm Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(0, 0, 0, 0.3)',
                          borderRadius: '8px',
                          color: '#000',
                          padding: '10px 45px 10px 12px',
                          fontSize: '14px',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'transparent',
                          border: 'none',
                          color: '#000',
                          cursor: 'pointer',
                          padding: '5px',
                          fontSize: '16px'
                        }}
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Aadhaar and PAN Input */}
                <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="aadhaar" className="form-label mb-1" style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="aadhaar"
                      name="aadhaar"
                      value={formData.aadhaar}
                      onChange={handleChange}
                      placeholder="Enter 12-digit Aadhaar"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#000',
                        border: '1px solid rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        fontSize: '14px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      maxLength="12"
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="pan" className="form-label mb-1" style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>
                      PAN Card Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="pan"
                      name="pan"
                      value={formData.pan}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#000',
                        border: '1px solid rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        fontSize: '14px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      maxLength="10"
                      required
                    />
                  </div>
                </div>

                {/* Address Fields */}
                <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="city" className="form-label mb-1" style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#000',
                        border: '1px solid rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        fontSize: '14px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="state" className="form-label mb-1" style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>
                      State
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Enter your state"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#000',
                        border: '1px solid rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        fontSize: '14px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="country" className="form-label mb-1" style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>
                      Country
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Enter your country"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#000',
                        border: '1px solid rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        fontSize: '14px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6 mb-2">
                    <label htmlFor="pinCode" className="form-label mb-1" style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>
                      Pin Code
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="pinCode"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      placeholder="123456"
                      maxLength="6"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#000',
                        border: '1px solid rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        fontSize: '14px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Profile Image Upload */}
                <div className="mb-2">
                  <label htmlFor="profileImage" className="form-label mb-1" style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>
                    Profile Image (optional)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="profileImage"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleChange}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#000',
                      border: '1px solid rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '14px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </div>

                {/* Consent */}
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    style={{ 
                      backgroundColor: consent ? '#000' : 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(0, 0, 0, 0.5)',
                      borderWidth: '2px',
                      accentColor: '#000',
                      cursor: 'pointer'
                    }}
                  />
                  <label className="form-check-label" htmlFor="consent" style={{ fontSize: '14px', color: '#000', cursor: 'pointer' }}>
                    I consent to my data being stored per DPDP Act, 2023.
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="btn w-100" 
                  disabled={loading} 
                  style={{ 
                    background: loading 
                      ? 'linear-gradient(135deg, #999 0%, #777 100%)' 
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: loading ? '#ccc' : '#fff',
                    borderRadius: '8px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.opacity = '0.9';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {loading ? (
                    <>
                      <ClipLoader color="#fff" size={16} />
                      <span>Signing up...</span>
                    </>
                  ) : (
                    'Sign up'
                  )}
                </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
