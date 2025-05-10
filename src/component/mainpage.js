import React, { useEffect, useContext } from 'react';
import Postcard from './postcard';
import mainContext from '../Context/mainContext';

const Mainpage = (props) => {
  const context = useContext(mainContext);
  const { GetAllPost, Posts } = context;

  useEffect(() => {
    GetAllPost();
  }, []);

  return (
    <div
      style={{
        background: 'white',
        minHeight: '100vh',
        padding: '2rem 1rem',
        borderRadius: '15px',
        boxShadow : "0px 0px 10px"
      }}
    >
      <div className="container">
        <h1
          style={{
            color: '#FFD700',
            fontSize: '3rem',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '0px 0px 20px black',
            marginBottom: '1.5rem',
          }}
        >
          POSTS
        </h1>
        <div className="row my-4">
          <div
            className="container text-center text-muted"
            style={{
              color: '#AAAAAA',
              fontSize: '1.2rem',
              marginBottom: '1rem',
            }}
          >
            {Array.isArray(Posts) && Posts.length === 0 && 'Please Wait Some Seconds, Loading......'}
          </div>
          {/* Map over Posts */}
          {Array.isArray(Posts) &&
            Posts.slice()
              .sort((a, b) => new Date(b.fromDate) - new Date(a.fromDate))
              .map((record) => (
                <Postcard
                  key={record._id}
                  EditTheAlert={props.EditTheAlert}
                  post={record}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Mainpage;
