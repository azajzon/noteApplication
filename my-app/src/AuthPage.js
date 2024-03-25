// AuthPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Registration from './Registration';
import Login from './Login';

function AuthPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
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
