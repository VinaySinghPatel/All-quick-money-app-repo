import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ClipLoader } from 'react-spinners';

const SignUp = ({ EditTheAlert }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadhaar: '',
    pan: '',
    profileImage: null,
  });

  const [consent, setConsent] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleVerifyAadhaar = async () => {
    if (!validateAadhaar(formData.aadhaar)) {
      EditTheAlert('Error', 'Aadhaar number must be 12 digits.');
      return;
    }

    setLoading(true);
    try {
      // You should move this logic to your backend for security
      const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJBbFJiNVdDbThUbTlFSl9JZk85ejA2ajlvQ3Y1MXBLS0ZrbkdiX1RCdkswIn0.eyJleHAiOjE3NDY5NDUxMzUsImlhdCI6MTc0Njk0MzkzNSwianRpIjoiZjcyMjEwYjQtNWExYS00ZDdkLTliMjktNjhhYjRlOGQwNGI3IiwiaXNzIjoiaHR0cHM6Ly9kZXYubmRobS5nb3YuaW4vYXV0aC9yZWFsbXMvY2VudHJhbC1yZWdpc3RyeSIsImF1ZCI6WyJhY2NvdW50IiwiU0JYVElEXzAwNjU3NiJdLCJzdWIiOiJlNzRiYTkzYS00YTkxLTRmOTAtYTI5OC1jZjUxNTFkMzhhZTkiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJTQlhJRF8wMDgxNzUiLCJzZXNzaW9uX3N0YXRlIjoiNjdhNjYzOTAtOTVkOC00ZDIxLTkxODItMWY1NTM2OGFhY2FjIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjkwMDciXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIkRJR0lfRE9DVE9SIiwiaGZyIiwiaGl1Iiwib2ZmbGluZV9hY2Nlc3MiLCJoZWFsdGhJZCIsInBociIsIk9JREMiLCJoZWFsdGhfbG9ja2VyIiwiaGlwIiwiaHBfaWQiXX0sInJlc291cmNlX2FjY2VzcyI6eyJTQlhJRF8wMDgxNzUiOnsicm9sZXMiOlsidW1hX3Byb3RlY3Rpb24iXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfSwiU0JYVElEXzAwNjU3NiI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImNsaWVudEhvc3QiOiIxMDAuNjUuMTYwLjIxNSIsImNsaWVudElkIjoiU0JYSURfMDA4MTc1IiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LXNieGlkXzAwODE3NSIsImNsaWVudEFkZHJlc3MiOiIxMDAuNjUuMTYwLjIxNSJ9.h-V2wATKsHNdhxRihmjAnHzsjAm31BIyhGw52t5mxeifdgQWNPMbSyMtLyqTD1NkINb8Pm4OgN5U44yP_XokFwZZYDXY_4jFbW9EmYlrRlSgjkmHKHhSy3DRyQF3TaXFWnWlemgkzmejU6qdqp25bBe43MeNp538TovqHFnXM-0IInIpttjKiIW8YWouVyxKBu8rQvsQIwmy555ZPuvYzZovSVPgDdkdVHJp3HqqZYC4k6rTdYkNSCuggskH7t6dO4xMKwwk2xLD94uTcg3_K1aykofyixsQiKx4kXwKv_ftQNz71kYyTzg3E49D_ubdKHwId6_HLaQ8DXA04ubIIw";
      const response = await fetch('https://apihspsbx.abdm.gov.in/v4/int/v2/registration/aadhaar/generateOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          "Authorization" : `Bearer ${token}`
         },
        body: JSON.stringify({
          aadhaar_number: "lr14PfSgHgUDWoXtcM6BmWaeLov0FjPPM7YlyvXWR18Ru/mLVpYbLmQucNCl6i4ebRsfK7F85N+EPVNlmT9wvAnBoWG5pHkJBao5Qr/uZxdw6MWvD2HnoPt1fCc6XmhrHYOOgurxa6sj19LiQkr4rxZxrxathU6kCnt6IAeTkM3ElfnUAcGkThZUe99xGnb6Cpq92Gv4KJS7632UT6n7z8QVNwa77GlU/nF5sQ3pAXxdkZqqnQeTzGhaaSiBM8D+7/Ma9T6K4QfiLznKeUUd52mEbM7TNMH3b1YcUjATWi17iBNfjr1I27gYmjnOpq3WOgerMZ7EsePwxHAw+8dV2w==",
        }),
      });

      const data = await response.json();
      if (data.id && data.url) {
        window.open(data.url, '_blank');
        EditTheAlert('Info', 'Complete Aadhaar OTP verification in the new window.');
      } else {
        EditTheAlert('Error', data.message || 'Failed to initiate Aadhaar eKYC.');
      }
    } catch (err) {
      console.error('Aadhaar verification error:', err);
      EditTheAlert('Error', 'An error occurred during Aadhaar verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, aadhaar, pan, profileImage } = formData;

    if (!name || !email || !password || !confirmPassword || !aadhaar || !pan) {
      EditTheAlert('Error', 'All fields are required.');
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
    if (!aadhaarVerified) {
      EditTheAlert('Error', 'Please verify your Aadhaar number.');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', name);
      data.append('email', email);
      data.append('password', password);
      data.append('aadhaar', aadhaar);
      data.append('pan', pan);
      if (profileImage) data.append('profileImage', profileImage);

      const response = await fetch('https://backendofquickmoney.onrender.com/api/auth/signup', {
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
      className="container-fluid py-5"
      style={{
        background: 'linear-gradient(135deg, #1e1e2f, #2a2a3d)',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4" data-aos="fade-up">
          <div className="card text-white" style={{
            background: 'linear-gradient(135deg, #2a2a3d, #3a3a4d)',
            border: 'none',
            borderRadius: '15px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
          }}>
            <div className="card-header text-center" style={{ background: 'linear-gradient(90deg, #FFD700, #FFC107)', color: '#1e1e2f' }}>
              <h4 className="fw-bold mb-0">Sign Up</h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {[
                  { label: 'Full Name', type: 'text', name: 'name', placeholder: 'Enter your full name' },
                  { label: 'Email', type: 'email', name: 'email', placeholder: 'Enter your email' },
                  { label: 'Password', type: 'password', name: 'password', placeholder: 'Enter your password' },
                  { label: 'Confirm Password', type: 'password', name: 'confirmPassword', placeholder: 'Confirm your password' },
                ].map(({ label, type, name, placeholder }) => (
                  <div className="mb-3" key={name}>
                    <label htmlFor={name} className="form-label">{label}</label>
                    <input
                      type={type}
                      className="form-control"
                      id={name}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      style={{ background: '#1e1e2f', color: '#fff', border: '1px solid #FFD700', borderRadius: '10px' }}
                      required
                    />
                  </div>
                ))}

                {/* Aadhaar Input */}
                <div className="mb-3">
                  <label htmlFor="aadhaar" className="form-label">Aadhaar Number</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="aadhaar"
                      name="aadhaar"
                      value={formData.aadhaar}
                      onChange={handleChange}
                      placeholder="Enter 12-digit Aadhaar number"
                      style={{ background: '#1e1e2f', color: '#fff', border: '1px solid #FFD700', borderRadius: '10px 0 0 10px' }}
                      maxLength="12"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-warning"
                      onClick={handleVerifyAadhaar}
                      disabled={loading || aadhaarVerified}
                      style={{ borderRadius: '0 10px 10px 0' }}
                    >
                      {loading ? <ClipLoader color="#1e1e2f" size={20} /> : aadhaarVerified ? 'Verified' : 'Verify Aadhaar'}
                    </button>
                  </div>
                  {!aadhaarVerified && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success mt-2"
                      onClick={() => setAadhaarVerified(true)}
                    >
                      ✅ I’ve completed Aadhaar verification
                    </button>
                  )}
                  {aadhaarVerified && <p className="text-success mt-2">Aadhaar verified successfully ✅</p>}
                </div>

                {/* PAN Input */}
                <div className="mb-3">
                  <label htmlFor="pan" className="form-label">PAN Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="pan"
                    name="pan"
                    value={formData.pan}
                    onChange={handleChange}
                    placeholder="Enter 10-character PAN (e.g., ABCDE1234F)"
                    style={{ background: '#1e1e2f', color: '#fff', border: '1px solid #FFD700', borderRadius: '10px' }}
                    maxLength="10"
                    required
                  />
                </div>

                {/* Profile Image Upload */}
                <div className="mb-3">
                  <label htmlFor="profileImage" className="form-label">Profile Image (optional)</label>
                  <input
                    type="file"
                    className="form-control"
                    id="profileImage"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleChange}
                    style={{ background: '#1e1e2f', color: '#fff', border: '1px solid #FFD700', borderRadius: '10px' }}
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
                  />
                  <label className="form-check-label" htmlFor="consent">
                    I consent to my data being stored per DPDP Act, 2023.
                  </label>
                </div>

                <button type="submit" className="btn btn-success w-100" disabled={loading} style={{ borderRadius: '10px' }}>
                  {loading ? <ClipLoader color="#fff" size={20} /> : 'Sign Up'}
                </button>
              </form>
            </div>
            <div className="card-footer text-center" style={{ background: '#2a2a3d', borderRadius: '0 0 15px 15px' }}>
              <p className="mb-0">
                Already have an account? <a href="/login" className="text-warning">Log In</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
