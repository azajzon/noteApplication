const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Note = require('./models/note'); 


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
        const { username, password } = req.body;

        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        if (password !== user.password) { // Again, consider using a secure method for password comparison
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Manually construct user data to exclude the password
        const userData = {
            _id: user._id,
            username: user.username,
            name: user.name,
        };

        res.json({ user: userData, message: 'User logged in successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        const { title, content, username, category } = req.body;
    
        const newNote = new Note({
          title,
          content,
          username,
          category
        });
    
        await newNote.save();
        res.status(201).json(newNote);
      } catch (error) {
        console.error('Failed to save note:', error);
        res.status(500).json({ message: 'Failed to save note.' });
      }
  });

  app.get('/api/filter', async (req, res) => {
    try {
         console.log("hello");
         const { title, category, length } = req.query;
        
         // Construct the query object based on provided parameters
         let query = {};
         if (title) {
             query.title = { $regex: title, $options: 'i' }; // Case-insensitive search
         }
         if (category) {
            query.category = category;
        }
        if (length) {
            query.content = { $regex: `.{${length},}` }; // Match content with at least 'length' characters
        }

        const notes = await Note.find(query);
        res.json(notes);
    } catch (error) {
        console.error('Failed to fetch filtered notes:', error);
        res.status(500).json({ message: 'Failed to fetch filtered notes' });
    }
  });


  app.put('/api/notes/:noteId', async (req, res) => {
    try {
        const { noteId } = req.params;
        const { title, content, category } = req.body;
        const updatedNote = await Note.findOneAndUpdate(
            { noteId: noteId },
            { $set: { title, content, category }},
            { new: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(updatedNote);
    } catch (error) {
        console.error('Failed to update note:', error);
        res.status(500).json({ message: 'Failed to update note.' });
    }
});

  app.get('/api/notes/:username', async (req, res) => {
    try {
      const username = req.params.username;
      const notes = await Note.find({ username: username });
      res.json(notes);
    } catch (error) {
      console.error('Failed to retrieve notes:', error);
      res.status(500).json({ message: 'Failed to retrieve notes.' });
    }
  });



  


  app.delete('/api/notes/:noteId', async (req, res) => {
    try {
        console.log("deletion endpoint");
        const { noteId } = req.params;
        const deletedNote = await Note.findOneAndDelete({ noteId: noteId });
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Failed to delete note:', error);
        res.status(500).json({ message: 'Failed to delete note.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
