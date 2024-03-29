// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  const { name, username, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if ((username.length < 3 || password.length < 3)) {
      setError('Username and password cannot be empty');
      return;
    }
    if (username > 20 || password > 20) {
      setError('Username and password cannot be greater than 20 characters');
      return;
    }

    try {
      const newUser = {
        name,
        username,
        password,
      };

      axios.post('http://localhost:3001/api/users/register', newUser);
      alert('Registered successfully');
    } catch (error) {
      console.error(error.response.data);
      alert('Error in registration');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={e => onSubmit(e)} className="register-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="username"
            placeholder="username"
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
        <button type="submit">Register</button>
      </form>

      <style jsx>{`
        .register-container {
          max-width: 400px;
          margin: auto;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          background-color: #fff;
        }
        .register-form {
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
          width: calc(100% - 22px); /* Adjust input width considering padding */
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

export default Register;
