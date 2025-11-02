import React, { useState, useContext } from "react";
import mainContext from "../Context/mainContext";

const NewPost = (props) => {
  const context = useContext(mainContext);
  const { AddPost } = context;

  const [Post, SetPost] = useState({
    tittle: "",
    money: "",
    description: "",
    mobilenumber: "",
  });

  const handleclick = (e) => {
    e.preventDefault();
    AddPost(Post.tittle, Post.money, Post.description, Post.mobilenumber);
    SetPost({ tittle: "", money: "", description: "", mobilenumber: "" });
    props.EditTheAlert("Success", "Successfully Added");
  };

  const onChange = (e) => {
    SetPost({ ...Post, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="container-fluid d-flex align-items-center justify-content-center"
      style={{
        background: 'transparent',
        minHeight: '100vh',
        width: '100%',
        padding: '60px 20px',
        margin: '0'
      }}
    >
      <div
        className="card text-white p-4"
        style={{
          width: '100%',
          maxWidth: '700px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          border: '2px solid #000'
        }}
      >
        <div 
          className="card-header text-center py-4 mb-4"
          style={{ 
            background: 'linear-gradient(135deg, #8456ce, #4066df)',
            color: '#1e1e2f',
            borderRadius: '20px',
            border: 'none'
          }}
        >
          <h2 className="mb-0 fw-bold">Create a New Post</h2>
        </div>
      <form className="row g-4 needs-validation" noValidate>
     
        <div className="col-12">
          <label
            htmlFor="tittle"
            style={{
              color: "#000",
              fontWeight: "600",
              fontSize: "1rem",
              marginBottom: "8px",
              display: "block",
            }}
          >
           For How Much Time :
          </label>
          <input
            type="text"
            className="form-control"
            name="tittle"
            id="tittle"
            onChange={onChange}
            value={Post.tittle}
            placeholder="Enter Title"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: "#000000",
              border: "1px solid #000",
              borderRadius: "10px",
              padding: "12px",
              fontSize: "1rem",
            }}
            required
          />
        </div>

        <div className="col-12">
          <label
            htmlFor="money"
            style={{
              color: "#000",
              fontWeight: "600",
              fontSize: "1rem",
              marginBottom: "8px",
              display: "block",
            }}
          >
            Loan Amount (₹)
          </label>
          <input
            type="number"
            className="form-control"
            name="money"
            id="money"
            onChange={onChange}
            value={Post.money}
            placeholder="Enter Loan Amount (₹)"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: "#000000",
              border: "1px solid #000",
              borderRadius: "10px",
              padding: "12px",
              fontSize: "1rem",
            }}
            required
          />
        </div>

        <div className="col-12">
          <label
            htmlFor="description"
            style={{
              color: "#000",
              fontWeight: "600",
              fontSize: "1rem",
              marginBottom: "8px",
              display: "block",
            }}
          >
            Loan Interest Rate
          </label>
          <textarea
            className="form-control"
            name="description"
            id="description"
            onChange={onChange}
            value={Post.description}
            placeholder="Enter Loan Interest Rate (e.g., 5% per month)"
            rows="1"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: "#000000",
              border: "1px solid #000",
              borderRadius: "10px",
              padding: "12px",
              fontSize: "1rem",
            }}
            required
          />
        </div>

        <div className="col-12">
          <label
            htmlFor="mobilenumber"
            style={{
              color: "#000",
              fontWeight: "600",
              fontSize: "1rem",
              marginBottom: "8px",
              display: "block",
            }}
          >
            Mobile Number
          </label>
          <input
            type="tel"
            className="form-control"
            name="mobilenumber"
            id="mobilenumber"
            onChange={onChange}
            value={Post.mobilenumber}
            placeholder="Enter Mobile Number"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: "#000000",
              border: "1px solid #000",
              borderRadius: "10px",
              padding: "12px",
              fontSize: "1rem",
            }}
            required
          />
        </div>

        <div className="col-12">
          <button
            className="btn btn-warning w-100"
            onClick={handleclick}
            style={{
              background: "linear-gradient(135deg, #8456ce, #4066df)",
              color: "#1e1e2f",
              fontWeight: "600",
              fontSize: "1.1rem",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 15px rgba(132, 86, 206, 0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(132, 86, 206, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(132, 86, 206, 0.3)";
            }}
          >
            Publish Post
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default NewPost;
