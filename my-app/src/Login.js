// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });


  const { username, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    try {
      const userCredentials = {
        username,
        password,
      };

      const response = await axios.post('http://localhost:3001/api/users/login', userCredentials);
      console.log(response.data);
      onLoginSuccess();
      // You should handle the login logic here,
      // like storing the JWT token sent from the server after successful authentication
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      alert('Error logging in');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={e => onSubmit(e)} className="login-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      <style jsx>{`
        .login-container {
          max-width: 400px;
          margin: auto;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          background-color: #fff;
        }
        .login-form {
          display: flex;
          flex-direction: column;
        }
        .form-group {
          margin-bottom: 15px;
        }
        input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: calc(100% - 22px);
        }
        button {
          background-color: #007bff;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
        h2 {
          text-align: center;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}

export default Login;
