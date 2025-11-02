import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import './profile.css';

const Profile = ({ EditTheAlert }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    mobilenumber: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('Authtoken');
      const userId = localStorage.getItem('userId');
      
      if (!token) {
        setError('Authentication token not found. Please log in.');
        EditTheAlert('Error', 'Please log in to view your profile.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      // Try the new getuser endpoint first
      let response = await fetch(`${API_BASE_URL}/api/auth/getuser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authtoken': token,
        },
      });

      // If getuser fails, fallback to GetUserData endpoint with userId
      if (!response.ok && userId) {
        console.log('getuser failed, trying GetUserData with userId');
        response = await fetch(`${API_BASE_URL}/api/auth/GetUserData/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || `Server error: ${response.status}` };
        }
        
        setError(errorData.error || `Server error: ${response.status}`);
        EditTheAlert('Error', errorData.error || 'Failed to fetch user data.');
        if (response.status === 401 || response.status === 400 || response.status === 404) {
          setTimeout(() => navigate('/login'), 2000);
        }
        return;
      }

      const data = await response.json();
      
      // Handle both response formats
      const userData = data.success ? data.user : data;
      
      if (userData && (userData._id || userData.id)) {
        setUser(userData);
        setEditForm({ 
          name: userData.name || '', 
          mobilenumber: userData.mobilenumber || '' 
        });
        setError(null);
      } else {
        setError('Invalid user data received from server.');
        EditTheAlert('Error', 'Invalid user data received from server.');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Network error: Unable to connect to server. Please check your connection.');
      EditTheAlert('Error', 'An error occurred while fetching user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update user data via API
      const token = localStorage.getItem('Authtoken');
      const userId = localStorage.getItem('userId');
      
      const response = await fetch(`${API_BASE_URL}/api/auth/updateuser/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authtoken': token,
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        await fetchUserData();
        setShowEditModal(false);
        EditTheAlert('Success', 'Profile updated successfully.');
      } else {
        const data = await response.json();
        EditTheAlert('Error', data.error || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      EditTheAlert('Error', 'An error occurred while updating profile.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const maskAadhar = (aadhar) => {
    if (!aadhar || aadhar.length < 4) return 'XXXX-XXXX-XXXX';
    return `XXXX-XXXX-${aadhar.slice(-4)}`;
  };

  const maskPAN = (pan) => {
    if (!pan || pan.length < 5) return 'XXXXX1234X';
    return `${pan.substring(0, 5)}${'*'.repeat(4)}${pan.slice(-1)}`;
  };

  if (loading) {
    return (
      <div className="profile-loading-container">
        <ClipLoader color="#4066df" size={60} />
        <p className="loading-text">Loading your profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-error-container">
        <div className="error-content">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <h2>Unable to Load Profile</h2>
          <p>{error || 'Failed to load user data. Please try again later.'}</p>
          <div className="error-actions">
            <Button 
              className="retry-btn"
              onClick={fetchUserData}
            >
              <i className="bi bi-arrow-clockwise"></i> Retry
            </Button>
            <Button 
              className="login-btn"
              onClick={() => navigate('/login')}
            >
              <i className="bi bi-box-arrow-in-right"></i> Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Hero Header Section */}
      <div className="profile-hero" data-aos="fade-down">
        <div className="hero-background"></div>
        <div className="hero-content">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" />
              ) : (
                <div className="avatar-initials">{getInitials(user.name)}</div>
              )}
              <div className="avatar-ring"></div>
              {user.verified && (
                <div className="verified-badge">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
              )}
            </div>
          </div>
          <div className="hero-info">
            <h1 className="profile-name">{user.name || 'User'}</h1>
            <p className="profile-username">@{user.username || user.email?.split('@')[0]}</p>
            {user.verified && (
              <span className="verified-tag">
                <i className="bi bi-shield-check"></i> Verified Account
              </span>
            )}
            <div className="hero-actions">
              <Button
                className="edit-profile-btn"
                onClick={() => setShowEditModal(true)}
              >
                <i className="bi bi-pencil-square"></i> Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - All Sections in One Container */}
      <div className="profile-content">
        <div className="container-fluid px-4 px-md-5">
          <div className="profile-main-container" data-aos="fade-up">
            <div className="profile-sections-grid">
              {/* Personal Information Section */}
              <div className="profile-section">
                <div className="section-header">
                  <i className="bi bi-person-circle"></i>
                  <h3>Personal Information</h3>
                </div>
                <div className="section-body">
                  <div className="data-row">
                    <div className="data-label">
                      <i className="bi bi-envelope"></i>
                      <span>Email</span>
                    </div>
                    <div className="data-value">{user.email || 'N/A'}</div>
                  </div>
                  
                  <div className="data-row">
                    <div className="data-label">
                      <i className="bi bi-phone"></i>
                      <span>Mobile</span>
                    </div>
                    <div className="data-value">{user.mobilenumber ? `+91 ${user.mobilenumber}` : 'N/A'}</div>
                  </div>

                  {user.username && (
                    <div className="data-row">
                      <div className="data-label">
                        <i className="bi bi-at"></i>
                        <span>Username</span>
                      </div>
                      <div className="data-value">@{user.username}</div>
                    </div>
                  )}

                  {user.aadharNumber && (
                    <div className="data-row">
                      <div className="data-label">
                        <i className="bi bi-card-text"></i>
                        <span>Aadhaar</span>
                      </div>
                      <div className="data-value">{maskAadhar(user.aadharNumber)}</div>
                    </div>
                  )}

                  {user.panCardNumber && (
                    <div className="data-row">
                      <div className="data-label">
                        <i className="bi bi-file-earmark-text"></i>
                        <span>PAN Card</span>
                      </div>
                      <div className="data-value">{maskPAN(user.panCardNumber)}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information Section */}
              <div className="profile-section">
                <div className="section-header">
                  <i className="bi bi-geo-alt"></i>
                  <h3>Address Information</h3>
                </div>
                <div className="section-body">
                  {user.city ? (
                    <div className="data-row">
                      <div className="data-label">
                        <i className="bi bi-building"></i>
                        <span>City</span>
                      </div>
                      <div className="data-value">{user.city}</div>
                    </div>
                  ) : (
                    <div className="data-row">
                      <div className="data-label">
                        <i className="bi bi-building"></i>
                        <span>City</span>
                      </div>
                      <div className="data-value text-muted">N/A</div>
                    </div>
                  )}

                  {user.state ? (
                    <div className="data-row">
                      <div className="data-label">
                        <i className="bi bi-map"></i>
                        <span>State</span>
                      </div>
                      <div className="data-value">{user.state}</div>
                    </div>
                  ) : (
                    <div className="data-row">
                      <div className="data-label">
                        <i className="bi bi-map"></i>
                        <span>State</span>
                      </div>
                      <div className="data-value text-muted">N/A</div>
                    </div>
                  )}

                  {user.country ? (
                    <div className="data-row">
                      <div className="data-label">
                        <i className="bi bi-globe"></i>
                        <span>Country</span>
                      </div>
                      <div className="data-value">{user.country}</div>
                    </div>
                  ) : (
                    <div className="data-row">
                      <div className="data-label">
                        <i className="bi bi-globe"></i>
                        <span>Country</span>
                      </div>
                      <div className="data-value text-muted">N/A</div>
                    </div>
                  )}

                  {user.pinCode ? (
                    <div className="data-row">
                      <div className="data-label">
                        <i className="bi bi-pin-map"></i>
                        <span>Pin Code</span>
                      </div>
                      <div className="data-value">{user.pinCode}</div>
                    </div>
                  ) : (
                    <div className="data-row">
                      <div className="data-label">
                        <i className="bi bi-pin-map"></i>
                        <span>Pin Code</span>
                      </div>
                      <div className="data-value text-muted">N/A</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information Section */}
              <div className="profile-section">
                <div className="section-header">
                  <i className="bi bi-info-circle"></i>
                  <h3>Account Information</h3>
                </div>
                <div className="section-body">
                  <div className="data-row">
                    <div className="data-label">
                      <i className="bi bi-person-check"></i>
                      <span>Status</span>
                    </div>
                    <div className="data-value">
                      {user.verified ? (
                        <span className="verified-status">
                          <i className="bi bi-check-circle-fill"></i> Verified
                        </span>
                      ) : (
                        <span className="unverified-status">
                          <i className="bi bi-x-circle-fill"></i> Not Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {user.fromDate && (
                    <div className="data-row">
                      <div className="data-label">
                        <i className="bi bi-calendar-check"></i>
                        <span>Member Since</span>
                      </div>
                      <div className="data-value">{formatDate(user.fromDate)}</div>
                    </div>
                  )}

                  {user._id && (
                    <div className="data-row">
                      <div className="data-label">
                        <i className="bi bi-fingerprint"></i>
                        <span>User ID</span>
                      </div>
                      <div className="data-value user-id-text">{user._id}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        className="profile-modal"
      >
        <Modal.Header className="modal-header-custom">
          <Modal.Title>
            <i className="bi bi-pencil-square"></i> Edit Profile
          </Modal.Title>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setShowEditModal(false)}
          ></button>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-person"></i> Name
              </Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
                className="form-control-custom"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="bi bi-phone"></i> Mobile Number
              </Form.Label>
              <Form.Control
                type="text"
                value={editForm.mobilenumber}
                onChange={(e) => setEditForm({ ...editForm, mobilenumber: e.target.value })}
                maxLength="10"
                pattern="[0-9]{10}"
                className="form-control-custom"
              />
            </Form.Group>
            <div className="modal-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowEditModal(false)}
                className="cancel-btn"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="save-btn"
              >
                <i className="bi bi-check-circle"></i> Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
