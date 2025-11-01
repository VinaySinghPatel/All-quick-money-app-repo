import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import PostCard from './postcard';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Profile = ({ EditTheAlert }) => {
  // Static dummy data for user
  const dummyUser = {
    name: 'Samarth Sharma',
    email: 'vinsy.pstel@example.com',
    aadhaarLastFour: '1234',
    pan: 'ABCDE1234F',
    mobilenumber: '9876543210',
    profilePicture: 'https://via.placeholder.com/150',
    isEmailVerified: true,
    consent: true,
    aadhaarDetails: { address: '123 Main Street, Mumbai, Maharashtra, India' },
  };

  const dummyPosts = {};
  // Static dummy data for posts
  // const dummyPosts = [
  //   {
  //     _id: '1',
  //     tittle: 'Loan Request',
  //     money: 5000,
  //     description: 'Need ₹5,000 for medical expenses.',
  //     mobilenumber: '9876543210',
  //     userId: { name: 'Vinsy Pstel', email: 'vinsy.pstel@example.com' },
  //     createdAt: '2025-05-11T12:00:00Z',
  //   },
  //   {
  //     _id: '2',
  //     tittle: 'Business Investment',
  //     money: 10000,
  //     description: 'Seeking ₹10,000 to start a small business.',
  //     mobilenumber: '9876543210',
  //     userId: { name: 'Vinsy Pstel', email: 'vinsy.pstel@example.com' },
  //     createdAt: '2025-05-10T10:00:00Z',
  //   },
  // ];

  // Static dummy data for civil score
  const dummyCivilScore = {
    factors: [
      { name: 'Payment History', weight: 35, score: 800 },
      { name: 'Credit Utilization', weight: 30, score: 700 },
      { name: 'Credit History Length', weight: 15, score: 750 },
      { name: 'Credit Types', weight: 10, score: 600 },
      { name: 'New Credit Inquiries', weight: 10, score: 650 },
    ],
    ratings: [
      { rating: 5, reviewerId: 'reviewer1', createdAt: '2025-05-01T12:00:00Z' },
      { rating: 4, reviewerId: 'reviewer2', createdAt: '2025-05-02T12:00:00Z' },
      { rating: 3, reviewerId: 'reviewer3', createdAt: '2025-05-03T12:00:00Z' },
      { rating: 5, reviewerId: 'reviewer4', createdAt: '2025-05-04T12:00:00Z' },
    ],
    overallScore: 720,
  };

  const [user, setUser] = useState(dummyUser);
  const [posts, setPosts] = useState(dummyPosts);
  const [civilScore, setCivilScore] = useState(dummyCivilScore);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: dummyUser.name,
    mobilenumber: dummyUser.mobilenumber || '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
    // Uncomment to fetch data from API
    /*
    const token = localStorage.getItem('Authtoken');
    if (!token) {
      EditTheAlert('Error', 'Please log in to view your profile.');
      navigate('/login');
      return;
    }
    fetchUserData();
    fetchUserPosts();
    fetchCivilScore();
    */
  }, [navigate]);

  // Keep API functions for reference
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://backendofquickmoney.onrender.com/api/auth/getuser', {
        headers: {
          'Content-Type': 'application/json',
          'Authtoken': localStorage.getItem('Authtoken'),
        },
      });
      const data = await response.json();
      if (data.success && data.user) {
        setUser(data.user);
        setEditForm({ name: data.user.name, mobilenumber: data.user.mobilenumber || '' });
      } else {
        EditTheAlert('Error', data.error || 'Failed to fetch user data.');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      EditTheAlert('Error', 'An error occurred while fetching user data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        EditTheAlert('Error', 'User ID not found. Please log in again.');
        return;
      }
      const response = await fetch(`https://backendofquickmoney.onrender.com/api/posts/getallpost/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authtoken': localStorage.getItem('Authtoken'),
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        EditTheAlert('Error', 'Failed to fetch posts.');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      EditTheAlert('Error', 'An error occurred while fetching posts.');
    }
  };

  const fetchCivilScore = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        EditTheAlert('Error', 'User ID not found. Please log in again.');
        return;
      }
      const response = await fetch(`https://backendofquickmoney.onrender.com/api/civilscore/getscore/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authtoken': localStorage.getItem('Authtoken'),
        },
      });
      const data = await response.json();
      if (data.success && data.civilScore) {
        setCivilScore(data.civilScore);
      } else {
        EditTheAlert('Error', data.error || 'Failed to fetch civil score.');
      }
    } catch (err) {
      console.error('Error fetching civil score:', err);
      EditTheAlert('Error', 'An error occurred while fetching civil score.');
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    try {
      setUser({ ...user, ...editForm });
      setShowEditModal(false);
      EditTheAlert('Success', 'Profile updated successfully.');
    } catch (err) {
      console.error('Error updating profile:', err);
      EditTheAlert('Error', 'An error occurred while updating profile.');
    }
  };

  // Pie chart data for civil score factors
  const factorChartData = {
    labels: civilScore.factors.map(f => `${f.name} (${f.weight}%)`),
    datasets: [{
      data: civilScore.factors.map(f => f.weight),
      backgroundColor: [
        '#FFD700', '#FFC107', '#FFB300', '#FFA000', '#FF8F00',
      ],
      borderColor: '#2a2a3d',
      borderWidth: 2,
      hoverOffset: 20,
    }],
  };

  // Pie chart data for ratings distribution
  const ratingCounts = [0, 0, 0, 0, 0]; // For 1-5 stars
  civilScore.ratings.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingCounts[r.rating - 1]++;
    }
  });
  const totalRatings = ratingCounts.reduce((sum, count) => sum + count, 0);
  const ratingPercentages = ratingCounts.map(count => totalRatings > 0 ? (count / totalRatings * 100).toFixed(1) : 0);

  const ratingChartData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'].map((label, i) => `${label} (${ratingPercentages[i]}%)`),
    datasets: [{
      data: ratingCounts,
      backgroundColor: [
        '#FF6F61', '#FF8A80', '#FFD700', '#4CAF50', '#388E3C',
      ],
      borderColor: '#2a2a3d',
      borderWidth: 2,
      hoverOffset: 20,
    }],
  };

  // Chart options for interactivity and style
  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#fff',
          font: { size: 14 },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#2a2a3d',
        titleColor: '#FFD700',
        bodyColor: '#fff',
        borderColor: '#FFD700',
        borderWidth: 1,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw;
            return `${label}: ${value}${context.datasetIndex === 0 ? '%' : ' ratings'}`;
          },
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    maintainAspectRatio: false,
  };

  if (loading) {
    return (
      <div className="text-center py-5" style={{ background: 'linear-gradient(135deg, #1e1e2f, #2a2a3d)', minHeight: '100vh' }}>
        <ClipLoader color="#FFD700" size={50} />
      </div>
    );
  }

  return (
    <div
      className="container-fluid py-5"
      style={{
        background: 'linear-gradient(135deg, #1e1e2f, #2a2a3d)',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      {/* Header Section */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-8 text-center" data-aos="fade-down">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="rounded-circle mb-3"
            style={{ width: '150px', height: '150px', objectFit: 'cover', border: '3px solid #FFD700' }}
          />
          <h2 className="mb-2">{user.name}</h2>
          <p className="text-muted">{user.isEmailVerified ? 'Verified User' : 'Unverified User'}</p>
          <Button
            variant="warning"
            onClick={() => setShowEditModal(true)}
            style={{ borderRadius: '10px' }}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-8" data-aos="fade-up">
          <div
            className="card text-white"
            style={{
              background: 'linear-gradient(135deg, #2a2a3d, #3a3a4d)',
              border: 'none',
              borderRadius: '15px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            }}
          >
            <div className="card-header" style={{ background: 'linear-gradient(90deg, #FFD700, #FFC107)', color: '#1e1e2f' }}>
              <h4 className="mb-0">Personal Information</h4>
            </div>
            <div className="card-body">
              <p><strong>Name:</strong> {user.name}</p>
              <p>
                <strong>Email:</strong> {user.email}{' '}
                {user.isEmailVerified && <span className="text-success"><i className="bi bi-check-circle"></i> Verified</span>}
              </p>
              <p><strong>Aadhaar:</strong> XXXX-XXXX-{user.aadhaarLastFour}</p>
              <p><strong>PAN:</strong> XXXXX{user.pan.slice(5)}</p>
              <p><strong>Mobile:</strong> {user.mobilenumber}</p>
              <p><strong>Address:</strong> {user.aadhaarDetails.address}</p>
              <p><strong>Data Consent:</strong> {user.consent ? 'Granted (DPDP Act, 2023)' : 'Not Granted'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Civil Score Section */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-10" data-aos="fade-up">
          <div
            className="card text-white"
            style={{
              background: 'linear-gradient(135deg, #2a2a3d, #3a3a4d)',
              border: 'none',
              borderRadius: '15px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            }}
          >
            <div className="card-header" style={{ background: 'linear-gradient(90deg, #FFD700, #FFC107)', color: '#1e1e2f' }}>
              <h4 className="mb-0">Civil Score Analysis</h4>
            </div>
            <div className="card-body">
              <p><strong>Overall Civil Score:</strong> {civilScore.overallScore}/1000</p>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <h5 style={{ color: '#FFD700' }}>Factors Breakdown</h5>
                  <div style={{ height: '300px' }}>
                    <Pie data={factorChartData} options={chartOptions} />
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <h5 style={{ color: '#FFD700' }}>Ratings Distribution</h5>
                  <div style={{ height: '300px' }}>
                    <Pie data={ratingChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts */}
      {/* <div className="row justify-content-center">
        <div className="col-md-10" data-aos="fade-up">
          <h3 className="mb-4" style={{ color: '#FFD700' }}>My Posts</h3>
          {posts.length === 0 ? (
            <p className="text-center">No posts created yet.</p>
          ) : (
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} EditTheAlert={EditTheAlert} />
              ))}
            </div>
          )}
        </div>
      </div> */}

      {/* Edit Profile Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        data-aos="zoom-in"
        dialogClassName="modal-dark"
      >
        <Modal.Header
          style={{
            background: 'linear-gradient(90deg, #FFD700, #FFC107)',
            color: '#1e1e2f',
            borderRadius: '15px 15px 0 0',
          }}
        >
          <Modal.Title>Edit Profile</Modal.Title>
          <button
            type="button"
            className="btn-close"
            style={{ filter: 'invert(1)' }}
            onClick={() => setShowEditModal(false)}
          ></button>
        </Modal.Header>
        <Modal.Body
          style={{
            background: 'linear-gradient(135deg, #2a2a3d, #3a3a4d)',
            color: '#fff',
          }}
        >
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
                style={{ background: '#1e1e2f', color: '#fff', border: '1px solid #FFD700', borderRadius: '10px' }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                value={editForm.mobilenumber}
                onChange={(e) => setEditForm({ ...editForm, mobilenumber: e.target.value })}
                maxLength="10"
                pattern="[0-9]{10}"
                style={{ background: '#1e1e2f', color: '#fff', border: '1px solid #FFD700', borderRadius: '10px' }}
              />
            </Form.Group>
            <Button
              variant="success"
              type="submit"
              style={{ borderRadius: '10px' }}
            >
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;