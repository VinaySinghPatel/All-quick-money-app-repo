import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import mainContext from '../Context/mainContext';
import Postcard from './postcard';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_BASE_URL from '../config/api';

const AllPosts = ({ EditTheAlert }) => {
  const context = React.useContext(mainContext);
  const { Posts, GetAllPost } = context;

  // Filter states
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    pinCode: '',
    startDate: '',
    endDate: ''
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [limit] = useState(9); // Posts per page

  // Fetch posts with filters and pagination
  const fetchPosts = async (page = 1, filterData = filters) => {
    setIsLoading(true);
    try {
      const response = await GetAllPost(filterData, page, limit);
      if (response) {
        setTotalPages(response.totalPages || 1);
        setTotalPosts(response.totalPosts || 0);
        setHasNextPage(response.hasNextPage || false);
        setHasPrevPage(response.hasPrevPage || false);
        setCurrentPage(response.currentPage || page);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      EditTheAlert('Error', 'Failed to load posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
    AOS.init({ duration: 1000 });
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchPosts(1, filters);
  };

  // Clear filters
  const handleClearFilters = () => {
    const emptyFilters = {
      city: '',
      state: '',
      pinCode: '',
      startDate: '',
      endDate: ''
    };
    setFilters(emptyFilters);
    setCurrentPage(1);
    fetchPosts(1, emptyFilters);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (hasNextPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchPosts(nextPage, filters);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchPosts(prevPage, filters);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    fetchPosts(page, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div
      className="container-fluid px-4 px-md-5 py-5"
      style={{ 
        background: 'transparent',
        minHeight: '100vh', 
        color: '#000',
        width: '100%',
        margin: '0'
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 className="text-center mb-5" style={{ 
          color: '#000', 
          fontSize: '2.5rem',
          fontWeight: '700',
          textShadow: '0 2px 15px rgba(0,0,0,0.2)'
        }} data-aos="fade-up">
          All Loan Posts
        </h2>

        {/* Filter Section */}
        <div 
          className="card mb-4" 
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)',
            border: '2px solid #000',
            borderRadius: '20px',
            padding: '1.5rem'
          }}
          data-aos="fade-up"
        >
          <h5 className="mb-3" style={{ color: '#4066df', fontWeight: 'bold' }}>
            <i className="bi bi-funnel me-2"></i>Filter Posts
          </h5>
          <div className="row g-3">
            <div className="col-md-6 col-lg-3">
              <label className="form-label" style={{ color: '#000', fontSize: '0.9rem', fontWeight: 'bold' }}>
                City
              </label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="Enter city name"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid #000',
                  color: '#000',
                  borderRadius: '10px'
                }}
              />
            </div>
            <div className="col-md-6 col-lg-3">
              <label className="form-label" style={{ color: '#000', fontSize: '0.9rem', fontWeight: 'bold' }}>
                State
              </label>
              <input
                type="text"
                className="form-control"
                name="state"
                value={filters.state}
                onChange={handleFilterChange}
                placeholder="Enter state name"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid #000',
                  color: '#000',
                  borderRadius: '10px'
                }}
              />
            </div>
            <div className="col-md-6 col-lg-3">
              <label className="form-label" style={{ color: '#000', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Area (Pin Code)
              </label>
              <input
                type="text"
                className="form-control"
                name="pinCode"
                value={filters.pinCode}
                onChange={handleFilterChange}
                placeholder="Enter pin code"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid #000',
                  color: '#000',
                  borderRadius: '10px'
                }}
              />
            </div>
            <div className="col-md-6 col-lg-3">
              <label className="form-label" style={{ color: '#000', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Start Date
              </label>
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid #000',
                  color: '#000',
                  borderRadius: '10px'
                }}
              />
            </div>
            <div className="col-md-6 col-lg-3">
              <label className="form-label" style={{ color: '#000', fontSize: '0.9rem', fontWeight: 'bold' }}>
                End Date
              </label>
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid #000',
                  color: '#000',
                  borderRadius: '10px'
                }}
              />
            </div>
            <div className="col-md-12 col-lg-9 d-flex align-items-end gap-2">
              <button
                className="btn btn-warning"
                onClick={handleApplyFilters}
                style={{
                  borderRadius: '10px',
                  padding: '8px 25px',
                  fontWeight: 'bold'
                }}
              >
                <i className="bi bi-search me-2"></i>Apply Filters
              </button>
              <button
                className="btn btn-outline-light"
                onClick={handleClearFilters}
                style={{
                  borderRadius: '10px',
                  padding: '8px 25px',
                  fontWeight: 'bold'
                }}
              >
                <i className="bi bi-x-circle me-2"></i>Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-3" style={{ color: '#000' }}>
          <p style={{ fontSize: '1rem' }}>
            Showing <strong>{totalPosts}</strong> {totalPosts === 1 ? 'post' : 'posts'}
            {totalPosts > 0 && (
              <span> (Page {currentPage} of {totalPages})</span>
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3" style={{ color: '#000' }}>Loading posts...</p>
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && (
          <>
            <div className="row g-4">
              {Array.isArray(Posts) && Posts.length === 0 && (
                <div className="text-center col-12" style={{ fontSize: '1.3rem', color: 'rgba(0, 0, 0, 0.8)' }} data-aos="fade-up">
                  No posts found. Try adjusting your filters or create a new post!
                </div>
              )}
              {Array.isArray(Posts) &&
                Posts.map((record) => (
                  <Postcard
                    key={record._id}
                    EditTheAlert={EditTheAlert}
                    post={record}
                  />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav aria-label="Posts pagination" className="mt-5">
                <ul className="pagination justify-content-center" style={{ flexWrap: 'wrap' }}>
                  <li className={`page-item ${!hasPrevPage ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={handlePrevPage}
                      disabled={!hasPrevPage}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#000',
                        borderRadius: '10px',
                        margin: '2px'
                      }}
                    >
                      Previous
                    </button>
                  </li>
                  {getPageNumbers().map((pageNum) => (
                    <li key={pageNum} className={`page-item ${pageNum === currentPage ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageClick(pageNum)}
                        style={{
                          background: pageNum === currentPage 
                            ? '#4066df' 
                            : 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: pageNum === currentPage ? '#000' : '#fff',
                          borderRadius: '10px',
                          margin: '2px',
                          fontWeight: pageNum === currentPage ? 'bold' : 'normal'
                        }}
                      >
                        {pageNum}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${!hasNextPage ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={handleNextPage}
                      disabled={!hasNextPage}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#000',
                        borderRadius: '10px',
                        margin: '2px'
                      }}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllPosts;
