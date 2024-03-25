const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

const dbURI = 'mongodb+srv://abzajzon:4281guava@cluster0.a90msu0.mongodb.net/test?retryWrites=true&w=majority';


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 3001;


app.post('/api/users/register', async (req, res) => {
    
    try {
        // Destructure the fields from req.body
        const { name, username, password } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        user = new User({
            name,
            username,
            password // this will be hashed before saving due to the schema's 'pre save' hook
        });

        // Save the user
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/users/login', async (req, res) => {
    try {
        // Destructure the fields from req.body
        const { username, password } = req.body;

        // Check if the user exists
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Directly compare the provided password with the password in the database
        if (password !== user.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If user is found and password matches, you can generate a token or start a session here
        // For now, just return a success message
        res.json({ message: 'User logged in successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
