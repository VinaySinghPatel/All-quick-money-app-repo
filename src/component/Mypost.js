import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ClipLoader } from 'react-spinners';
import mainContext from '../Context/mainContext';

const Mypost = (props) => {
    const context = useContext(mainContext);
    const navigate = useNavigate();
    const { GetPost, Posts, DeletePost, EditPost,MyPosts } = context;
    const [record, setRecord] = useState({ id: "", tittle: "", money: 0, description: "", mobilenumber: "" });
    const [isEditing, setIsEditing] = useState(false); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (localStorage.getItem('Authtoken')) {
       GetPost();
        } else {
            navigate('/');
        }
        AOS.init({ duration: 2000 });
    }, []);

    const ref = useRef(null);
    const refClose = useRef(null);

    const UpdateRecord = (post) => {
        ref.current.click();
        setRecord({
            id: post._id,
            tittle: post.tittle,
            money: post.money,
            description: post.description,
            mobilenumber: post.mobilenumber
        });
        setIsEditing(true);
    };

    const handleClick = async () => {
       await EditPost(record.id, record.tittle, record.money, record.description, record.mobilenumber);
        refClose.current.click();
        props.EditTheAlert("Success", "Record updated successfully");
         await     GetPost();
        setIsEditing(false);
    };

    const onChange = (e) => {
        setRecord({ ...record, [e.target.name]: e.target.value });
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm("Are you sure you want to delete this post?"))
             {
          await DeletePost(postId);
          await GetPost();
        }
      };

    const postDate = new Date();
    const day = postDate.getDate();
    const month = postDate.toLocaleString('default', { month: 'long' });
    const year = postDate.getFullYear();
    const hours = postDate.getHours().toString().padStart(2, '0');
    const minutes = postDate.getMinutes().toString().padStart(2, '0');
    const readableDate = `${day} ${month} ${year}, ${hours}:${minutes}`;

    return (
        <div>
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Edit Post
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '10px' }}>
                        <div className="modal-header bg-primary text-white" style={{ borderRadius: '10px 10px 0 0' }}>
                            <h5 className="modal-title" id="exampleModalLabel">Edit Record</h5>
                            <button ref={refClose} type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => setIsEditing(false)}></button>
                        </div>
                        <div className="modal-body p-4">
                            <form>
                                <div className="form-group mb-3">
                                    <label htmlFor="tittle" className="text-dark">Title</label>
                                    <input type="text" className="form-control border-2" id="tittle" name="tittle" value={record.tittle} onChange={onChange} placeholder="Enter title" />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="money" className="text-dark">Money</label>
                                    <input type="number" className="form-control border-2" id="money" name="money" value={record.money} onChange={onChange} placeholder="Enter amount" />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="description" className="text-dark">Loan-Rate</label>
                                    <textarea className="form-control border-2" id="description" name="description" value={record.description} onChange={onChange} rows="3" placeholder="Enter description"></textarea>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="mobilenumber" className="text-dark">Mobile Number</label>
                                    <input type="number" className="form-control border-2" id="mobilenumber" name="mobilenumber" value={record.mobilenumber} onChange={onChange} placeholder="Enter mobile number" />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer bg-light border-0">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setIsEditing(false)}>Close</button>
                            <button type="button" className="btn btn-success" onClick={handleClick}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ 
              background: 'transparent',
              minHeight: '100vh', 
              width: '100%',
              padding: '2rem 1rem',
              margin: '0'
            }}>
              <div className="container-fluid px-4 px-md-5">
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                  <h1 style={{
                    color: '#000',
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: '700',
                    textAlign: 'center',
                    textShadow: '0 2px 15px rgba(0,0,0,0.2)',
                    marginBottom: '2rem',
                  }}>YOUR POSTS</h1>
                                        <div className="row my-4">
                                            <div className="container text-muted">
                                                <div className="row">
                        {(!Array.isArray(MyPosts) || MyPosts.length === 0) && <p>No posts to display.</p>}
                        {Array.isArray(MyPosts) && MyPosts.map((post) => {
                            const postDate = new Date(post.fromDate);
                            const day = postDate.getDate();
                            const month = postDate.toLocaleString("default", { month: "long" });
                            const year = postDate.getFullYear();
                            const hours = postDate.getHours().toString().padStart(2, "0");
                            const minutes = postDate.getMinutes().toString().padStart(2, "0");
                            const readableDate = `${day} ${month} ${year}, ${hours}:${minutes}`;

                            return (
                                
                                        <div className="col-md-4" key={post._id} >
                                            <div className="card my-3 text-white" style={{
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                backdropFilter: 'blur(15px)',
                                                border: '2px solid #000',
                                                borderRadius: "20px",
                                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                                                transition: "all 0.3s ease",
                                                overflow: "hidden",
                                            }} 
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-10px)";
                                                e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.3)";
                                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.2)";
                                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    padding: '1rem',
                                                    background: 'linear-gradient(135deg, #8456ce, #4066df)',
                                                    borderRadius: '20px 20px 0 0',
                                                    color: '#1e1e2f'
                                                }}>
                                                    <img
                                                        src={'quickmoney.jpg'}
                                                        alt={`profile`}
                                                        style={{
                                                            width: '35px',
                                                            height: '35px',
                                                            borderRadius: '50%',
                                                            marginRight: '10px',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                    <span style={{
                                                        color: '#1e1e2f',
                                                        fontSize: '1rem',
                                                        fontWeight: 'bold',
                                                    }}> {post.userId.name} </span>
                                                </div>
                                                <div style={{ position: 'relative',
                                                        height: '5rem',
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
                                                        onLoad={handleImageLoad}
                                                    /> */}
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        color: '#4066df',
                                                        fontSize: '2rem',
                                                        fontWeight: 'bold',
                                                        textShadow: '3px 3px 8px black',
                                                    }}>
                                                   ₹{post.money} 
                                                    </div>
                                                </div>
                                                <hr/>
                                                <div className="card-body p-3">
                                                    <h6 className="card-title" style={{ color: "#000000", fontSize: "1rem" }}>
                                                     Mobile-Number :   {post.mobilenumber}
                                                    </h6>
                                                    <p style={{ fontSize: "0.85rem", color: "#4066df", fontWeight: "bold", marginBottom: "0.5rem" }}>
                                                        📊 Loan Interest Rate: <span style={{ color: "#000000" }}>{post.description}% per month</span>
                                                    </p>
                                                    <p className="card-time" style={{ fontSize: "0.75rem", color: "#AAAAAA" }}>
                                                        {readableDate}
                                                    </p>
                                                </div>
                                                <div className="card-footer border-0 d-flex justify-content-between align-items-center" style={{ background: 'rgba(0, 0, 0, 0.1)' }}>
                                                    <button className="btn btn-warning" onClick={() => UpdateRecord(post)}>Edit</button>
                                                    <button className="btn btn-danger" onClick={() => handleDeletePost(post._id)}>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                  
                            );
                        })}
                          </div>
                          </div>
                    </div>
                </div>
              </div>
            </div>
        </div>
    );
};

export default Mypost;
