import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext'; // Import UserProvider
import AuthPage from './AuthPage'; // This will be your new component containing both Registration and Login
import Home from './Home';

function App() {
  return (
    <Router>
      <UserProvider> {/* Wrap the Routes with UserProvider */}
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
