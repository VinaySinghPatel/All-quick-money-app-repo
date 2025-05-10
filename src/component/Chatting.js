// Chat.js
import React, { useEffect, useState } from "react";
import socket from "../socket";
import axios from "axios";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

 // let senderId=  localStorage.getItem('userId'); ;

 let senderId = "681f2bcecf6aa0c47f92f572";
  let receiverId="681ef9c6b442736906006ad2";
  
  useEffect(() => {
    
    // Join room when component mounts
    socket.emit("joinRoom", { senderId, receiverId });

    // Fetch chat history
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/Chat/history/${senderId}/${receiverId}`);
        if (response.data.success) {
          setChatLog(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      }
    };

    fetchChatHistory();

    // Listen for incoming messages
    socket.on("receiveMessage", (data) => {
      setChatLog((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, [senderId, receiverId]);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMessage = { senderId, receiverId, message };
    socket.emit("sendMessage", newMessage);
    setChatLog((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div style={{ padding: "1rem", maxWidth: 500, margin: "auto" }}>
      <h2>Chat</h2>
      <div style={{ border: "1px solid #ccc", padding: "1rem", height: 300, overflowY: "scroll" }}>
        {chatLog.map((msg, index) => (
          <div key={index} style={{ margin: "0.5rem 0" }}>
            <strong>{msg.senderId === senderId ? "You" : "Partner"}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
        style={{ width: "70%", marginRight: 10 }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chat;
