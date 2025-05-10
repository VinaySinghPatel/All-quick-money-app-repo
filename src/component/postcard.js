import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ClipLoader } from 'react-spinners';
import userEvent from '@testing-library/user-event';

const Postcard = (props) => {
  const { post } = props;
  const [isLoading, setIsLoading] = useState(true);

  const postDate = new Date(post.fromDate);
  const day = postDate.getDate();
  const month = postDate.toLocaleString('default', { month: 'long' });
  const year = postDate.getFullYear();
  const hours = postDate.getHours().toString().padStart(2, '0');
  const minutes = postDate.getMinutes().toString().padStart(2, '0');
  const readableDate = `${day} ${month} ${year}, ${hours}:${minutes}`;

  useEffect(() => {
    AOS.init({ duration: 2000 });
    
    setIsLoading(false);
  }, []);


  return (
    <div className="col-md-3">
      {isLoading && (
        <div
          className="loading-spinner d-flex justify-content-center align-items-center"
          style={{ height: '380px' }}
        >
          <ClipLoader color="#FFD700" size={50} />
        </div>
      )}
      <div
        className={`card my-3  text-dark ${isLoading ? 'd-none' : ''}`}
        style={{
          color : "black",
          background: 'darkgrey',
          boxShadow: '0px 0px 20px black',
          border : '1rem  black bold',
          borderStyle: "solid",
          borderRadius: '1.2rem',
          transition: 'transform 0.3s, box-shadow 0.3s',
          overflow: 'hidden',
          maxHeight: '420px', 
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0px 10px 25px rgba(0, 0, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0px 0px 20px black';
        }}
        // data-aos="fade-up"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent : "center",
            padding: '0.5rem',
            background: 'black',
            borderRadius: '1.2rem 1.2rem 0 0',
          }}
        >
          {/* <img
            src={'VinayPIC (2).jpg'}
            alt={`Vinay's profile`}
            style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              marginRight: '10px',
              objectFit: 'cover',
            }}
          /> */}
          <span
            style={{
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
            }}
          >
           {post.userId?.name}
          </span>
        </div>
        <div style={{ position: 'relative',  height: '50px',
              width: '100%', }}>
          {/* <img
            src="DoneWithThis.jpeg"
            style={{
              borderRadius: '0 0 1.2rem 1.2rem',
              height: '140px',
              width: '100%',
              objectFit: 'cover',
              filter: 'blur(4px)',
            }}
            className="card-img-top"
            alt="Indian Currency"
           
          /> */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'rgb(255, 165, 0)',
              fontSize: '2rem',
              fontWeight: 'bold',
              textShadow: '3px 3px 15px black',
              marginTop : "0.7rem"
            }}
            
          >
            ₹{post.money}
          </div>
        </div>
<hr/>
        <div className="card-body p-3">
          <p style={{ color: 'black', fontSize: '0.9rem',
              fontWeight: 'bold' }}>
           Contact 📞 : {post.mobilenumber}
          </p>
          <h6
            className="card-title"
            style={{ color: 'black', fontSize: '1rem' }}
          >
           For : {post.tittle}
          </h6>
          <p
            style={{
              fontSize: '0.85rem',
              color: 'black',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
            }}
          >
            📊 Loan Interest Rate: <span style={{ color: 'black' }}>{post.description}% per month</span>
          </p>
          <p
            className="card-time"
            style={{ fontSize: '0.75rem', color: 'black' }}
          >
           ( {readableDate} )
          </p>
        </div>
      </div>
    </div>
  );
};

export default Postcard;
