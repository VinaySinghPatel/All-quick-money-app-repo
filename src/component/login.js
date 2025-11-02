import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import API_BASE_URL from '../config/api';

const Login = (props) => {
  const navigate = useNavigate();
  const [Credential, ChangeCred] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    console.log('Submit');
    try {
      e.preventDefault();
      setLoading(true);
      let response = await fetch(`${API_BASE_URL}/api/auth/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: Credential.email, password: Credential.password }),
      });
      
      let json = await response.json();
      console.log(json);

      if (json.Succes) {
        // Save the Authtoken and User ID
        localStorage.setItem('Authtoken', json.Authtoken);
        localStorage.setItem('userId', json.userdata); // Save the userId 
        console.log(json._id);
        
        navigate('/');

        props.EditTheAlert('Success', 'Successfully You Are Logged In');
      } else {
        props.EditTheAlert('Error', 'There is an Error');
      }
    } catch (error) {
      console.log('Error in API Data Fetching:', error);
      props.EditTheAlert('Error', 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    ChangeCred({ ...Credential, [e.target.name]: e.target.value });
  };

  return (
    <div 
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{ 
        background: 'transparent',
        minHeight: '100vh',
        padding: '15px',
        margin: '0',
        width: '100%',
        overflowY: 'auto'
      }}
    >
      <div 
        className="card text-white"
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'transparent',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '2px solid #000',
          padding: '24px',
          margin: 'auto'
        }}
      >
        <div className="text-center mb-4">
          <h2 className="mb-0 fw-bold" style={{ fontSize: '22px', marginBottom: '6px', color: '#000' }}>
            Sign in to your account
          </h2>
          <p className="mb-0" style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '13px', marginTop: '6px' }}>
            Not a member?{' '}
            <a href="/SignUp" style={{ color: '#667eea', textDecoration: 'none' }}>Start a 14-day free trial</a>
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label mb-1" style={{ fontSize: '14px', fontWeight: '500' }}>
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              onChange={onChange}
              placeholder="name@company.com"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid #000',
                borderRadius: '8px',
                color: '#000',
                padding: '10px 12px',
                fontSize: '14px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label htmlFor="password" className="form-label mb-0" style={{ fontSize: '14px', fontWeight: '500' }}>
                Password
              </label>
              <a href="#" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>
                Forgot password?
              </a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="password"
                name="password"
                onChange={onChange}
                placeholder="••••••••"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid #000',
                  borderRadius: '8px',
                  color: '#000',
                  padding: '10px 45px 10px 12px',
                  fontSize: '14px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
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
                  color: 'rgba(0, 0, 0, 0.6)',
                  cursor: 'pointer',
                  padding: '5px',
                  fontSize: '16px'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="mb-3 d-flex justify-content-between align-items-center">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="remember"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              />
              <label className="form-check-label" htmlFor="remember" style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                Remember me
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn w-100"
            disabled={loading}
            style={{
              background: loading 
                ? 'linear-gradient(135deg, #999 0%, #777 100%)' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: loading ? '#fff' : '#000',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
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
                <ClipLoader color="#000" size={16} />
                <span style={{ color: '#000' }}>Signing in...</span>
              </>
            ) : (
              <span style={{ color: '#000' }}>Sign in</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
