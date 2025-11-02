import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './component/navbar';
import Mainpage from './component/mainpage';
import MainMoney from "./Context/mainMoney";
import Login from './component/login';
import SignUp from './component/signUp';
import Newpost from "./component/NewPost";
import Profile from "./component/profile";
import MyPost from "./component/Mypost";
import VerifyUser from "./component/verifyUser";
import Chat from "./component/Chatting";
import AllPosts from "./component/AllPosts";
import Messages from "./component/Messages";
import AllNotifications from "./component/AllNotifications";
import NotificationUserDetail from "./component/NotificationUserDetail";
import { socket } from './socket';
import toast from './utils/toast';

// Component to handle authentication check
const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // List of public routes that don't require authentication
    const publicRoutes = ['/login', '/SignUp', '/', '/allposts'];
    
    // Check if current route is public
    const isPublicRoute = publicRoutes.includes(location.pathname);
    
    // Get authentication tokens
    const authtoken = localStorage.getItem('Authtoken');
    const userId = localStorage.getItem('userId');
    
    // If not a public route and missing auth, redirect to login
    if (!isPublicRoute && (!authtoken || !userId)) {
      navigate('/login');
      toast.show('Error', 'Please log in to access this page.');
    }
  }, [location.pathname, navigate]);

  return children;
};

function App() {
  useEffect(() => {
    // Connect to the server
    socket.connect();

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    // Event listener for receiving messages
    socket.on('receiveMessage', (data) => {
      console.log('New message:', data);
    });

    // Cleanup on unmount
    return () => {
      socket.off('receiveMessage'); // Remove listener for the event
      socket.disconnect(); // Disconnect when the component unmounts
    };
  }, []);

  return (
    <>
      <MainMoney>
        <Router>
          <AuthGuard>
            <Navbar />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              <Route exact path="/" element={<Mainpage EditTheAlert={toast.show} />} />
              <Route exact path="/allposts" element={<AllPosts EditTheAlert={toast.show} />} />
              <Route exact path="/login" element={<Login EditTheAlert={toast.show} />} />
              <Route exact path="/chat" element={<Chat EditTheAlert={toast.show} />} />
              <Route exact path="/messages" element={<Messages EditTheAlert={toast.show} />} />
              <Route exact path="/SignUp" element={<SignUp EditTheAlert={toast.show} />} />
              <Route exact path="/NewPost" element={<Newpost EditTheAlert={toast.show} />} />
              <Route exact path="/Profile" element={<Profile EditTheAlert={toast.show} />} />
              <Route exact path="/MyPost" element={<MyPost EditTheAlert={toast.show} />} />
              <Route exact path="/Verify" element={<VerifyUser EditTheAlert={toast.show} />} />
              <Route exact path="/notifications" element={<AllNotifications />} />
              <Route exact path="/notification-detail/:id" element={<NotificationUserDetail />} />
            </Routes>
          </AuthGuard>
        </Router>
      </MainMoney>
    </>
  );
}

export default App;
