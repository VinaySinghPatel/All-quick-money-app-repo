import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import MainContext from '../Context/mainContext';
import Chat from './Chatting';
import API_BASE_URL from '../config/api';
import { FaComments } from 'react-icons/fa';

const Messages = ({ EditTheAlert }) => {
  const context = useContext(MainContext);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!localStorage.getItem('Authtoken')) {
      EditTheAlert('Error', 'Please log in to view messages.');
      return;
    }

    if (userId) {
      fetchConversations();
    }
  }, [userId]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      if (!userId) {
        EditTheAlert('Error', 'User ID not found. Please log in again.');
        return;
      }
      
      if (context && context.GetConversations) {
        const result = await context.GetConversations();
        if (result && result.success) {
          setConversations(result.data || []);
        } else {
          EditTheAlert('Warning', result?.error || 'Failed to load conversations.');
        }
      } else {
        // Fallback: direct API call
        const response = await fetch(`${API_BASE_URL}/api/Chat/conversations/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        
        const json = await response.json();
        if (json.success) {
          setConversations(json.data || []);
        } else {
          EditTheAlert('Warning', json.error || 'Failed to load conversations.');
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      EditTheAlert('Error', error.message || 'Failed to load conversations. Please try again.');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleCloseChat = () => {
    setSelectedConversation(null);
    // Refresh conversations to get updated last message
    fetchConversations();
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (!message) return '';
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  return (
    <div className="container-fluid" style={{ padding: '2rem', minHeight: '80vh' }}>
      <div className="row">
        {/* Conversations List */}
        <div className={`col-md-${selectedConversation ? '4' : '12'} mb-4`}>
          <div className="card shadow-lg" style={{ 
            borderRadius: '15px', 
            border: '2px solid #000',
            height: selectedConversation ? '600px' : 'auto',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div className="card-header" style={{ 
              background: 'linear-gradient(135deg, #8456ce, #4066df)', 
              color: '#fff',
              padding: '1.5rem',
              borderBottom: '2px solid #000'
            }}>
              <h4 className="mb-0 d-flex align-items-center">
                <FaComments style={{ marginRight: '10px' }} />
                Messages
              </h4>
            </div>

            <div className="card-body p-0" style={{ 
              flex: 1, 
              overflowY: 'auto',
              background: '#f8f9fa'
            }}>
              {loading ? (
                <div className="text-center p-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading conversations...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center p-5">
                  <FaComments size={50} style={{ color: '#ccc', marginBottom: '1rem' }} />
                  <p style={{ color: '#666' }}>No conversations yet. Start chatting to see messages here!</p>
                </div>
              ) : (
                conversations.map((conv, index) => (
                  <div
                    key={conv.roomId || index}
                    onClick={() => handleConversationClick(conv)}
                    className="p-3 border-bottom"
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      background: selectedConversation?.roomId === conv.roomId ? '#e9ecef' : '#fff',
                      borderLeft: selectedConversation?.roomId === conv.roomId ? '4px solid #8456ce' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedConversation?.roomId !== conv.roomId) {
                        e.currentTarget.style.background = '#f0f0f0';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedConversation?.roomId !== conv.roomId) {
                        e.currentTarget.style.background = '#fff';
                      }
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #8456ce, #4066df)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: '1.2rem',
                          marginRight: '15px',
                          flexShrink: 0
                        }}
                      >
                        {conv.otherParticipant?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <h6 className="mb-0" style={{ 
                            fontWeight: 'bold',
                            color: '#000',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {conv.otherParticipant?.name || 'Unknown User'}
                          </h6>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            color: '#666',
                            whiteSpace: 'nowrap',
                            marginLeft: '10px'
                          }}>
                            {formatTimestamp(conv.lastMessage?.timestamp)}
                          </span>
                        </div>
                        <p className="mb-0" style={{ 
                          fontSize: '0.9rem', 
                          color: '#666',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {conv.lastMessage?.isSentByMe && (
                            <span style={{ color: '#666', marginRight: '5px' }}>You: </span>
                          )}
                          {truncateMessage(conv.lastMessage?.message)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat Window */}
        {selectedConversation && (
          <div className="col-md-8 mb-4">
            <div style={{ position: 'relative', height: '600px' }}>
              <Chat
                senderId={userId}
                receiverId={selectedConversation.otherParticipant._id}
                receiverName={selectedConversation.otherParticipant.name}
                onClose={handleCloseChat}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;

