import React, { useEffect, useState, useRef } from "react";
import socket from "../socket";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { FaTimes, FaPaperPlane, FaSmile } from "react-icons/fa";

const Chat = ({ senderId, receiverId, onClose }) => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeout = useRef(null);

  const room = [senderId, receiverId].sort().join("-");

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinRoom", room);

    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `https://backendofquickmoney.onrender.com/api/Chat/history/${senderId}/${receiverId}`
        );
        if (res.data.success) setChatLog(res.data.data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchHistory();

    const handleIncomingMessage = (newMessage) => {
      setChatLog((prev) => {
        // Avoid duplicates: check timestamp & senderId
        if (
          !prev.find(
            (msg) =>
              msg.timestamp === newMessage.timestamp &&
              msg.senderId === newMessage.senderId
          )
        ) {
          return [...prev, newMessage];
        }
        return prev;
      });
    };

    const handleTyping = ({ room: typingRoom, isTyping }) => {
      if (typingRoom === room) setPartnerTyping(isTyping);
    };

    socket.on("receiveMessage", handleIncomingMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket.emit("leaveRoom", room);
      socket.off("receiveMessage", handleIncomingMessage);
      socket.off("typing", handleTyping);
    };
  }, [senderId, receiverId]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const newMessage = {
      senderId,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post("https://backendofquickmoney.onrender.com/api/Chat/send", newMessage);
      socket.emit("sendMessage", newMessage);
      setMessage("");
      setShowEmojiPicker(false);
      // ❌ Don't update chatLog here — it comes back via receiveMessage
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      socket.emit("typing", { room, isTyping: true });
      setIsTyping(true);
    }

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("typing", { room, isTyping: false });
      setIsTyping(false);
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatLog, partnerTyping]);

  return (
    <div className="card shadow-lg" style={{
      width: '100%',
      height: '500px',
      borderRadius: '15px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div className="card-header d-flex justify-content-between align-items-center p-3"
        style={{ backgroundColor: '#2c3e50', color: 'white' }}>
        <h5 className="mb-0">Chat with Partner</h5>
        <button onClick={onClose} className="btn btn-link text-white p-0">
          <FaTimes size={20} />
        </button>
      </div>

      <div className="card-body p-3" style={{
        flex: 1,
        overflowY: 'auto',
        background: '#f8f9fa',
      }}>
        {chatLog.map((msg, i) => (
          <div key={i} className={`d-flex ${msg.senderId === senderId ? 'justify-content-end' : 'justify-content-start'} mb-2`}>
            <div className={`p-2 rounded-3 ${msg.senderId === senderId ? 'bg-primary text-white' : 'bg-light'}`}
              style={{ maxWidth: '80%', wordBreak: 'break-word' }}>
              <div>{msg.message}</div>
              <div className="text-end" style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {partnerTyping && (
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>
            Partner is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="card-footer p-3 position-relative" style={{ backgroundColor: 'white' }}>
        {showEmojiPicker && (
          <div className="position-absolute bottom-100 mb-2" style={{ right: 0 }}>
            <EmojiPicker onEmojiClick={(e) => setMessage((m) => m + e.emoji)} />
          </div>
        )}

        <div className="input-group">
          <button className="btn btn-outline-secondary" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <FaSmile />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="form-control"
            placeholder="Type your message..."
            style={{ borderRadius: "25px" }}
          />
          <button className="btn btn-primary" onClick={handleSend}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
