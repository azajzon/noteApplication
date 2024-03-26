// Modify your existing AuthPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './contexts/UserContext'; // Import useUser
import Registration from './Registration';
import Login from './Login';

function AuthPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser(); // Destructure setUser from context

  const handleLoginSuccess = (user) => { 
    setIsLoggedIn(true);
    setUser(user); // Set the user in context
    navigate('/home'); // Navigate to the Home page on successful login
  };

  return (
    <div>
      {isLoggedIn ? null : (
        <>
          <Registration />
          <Login onLoginSuccess={handleLoginSuccess} />
        </>
      )}
    </div>
  );
}

export default AuthPage;
