const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const Note = require('./models/note'); 

const Joi = require('joi'); // Joi is a powerful schema description language and data validator for JS

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

const dbURI = 'mongodb+srv://abzajzon:4281guava@cluster0.a90msu0.mongodb.net/test?retryWrites=true&w=majority';


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 3001;

const noteSchemaJoi = Joi.object({
    title: Joi.string().min(1).max(30).required(),
    content: Joi.string().min(1).required(),
    username: Joi.string().min(1).max(30).required(),
  });

  const userSchemaJoi = Joi.object({
    username: Joi.string().min(1).max(30).required(),
    password: Joi.string().min(1).required(),
  });


app.post('/api/register', async (req, res) => {
    try {
        const { name, username, password } = req.body;

        // Basic input validation
        if (!username || !name || !password) {
            return res.status(400).json();
        }


        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json();
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { error } = userSchemaJoi.validate(req.body);
        if (error) {
            return res.status(400).json({ message: `Validation error: ${error.details.map(x => x.message).join(', ')}` });
        }

        user = new User({
            name,
            username,
            password: hashedPassword, 
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Compare provided password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Exclude the password in the response
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

app.post('/api/note', async (req, res) => {
    try {
        // Validate request body against the Joi schema
        const { value, error } = noteSchemaJoi.validate(req.body);
        if (error) {
            return res.status(400).json({ message: `Validation error: ${error.details.map(x => x.message).join(', ')}` });
        }

        const { title, content, username, category } = value;
    
        const newNote = new Note({
          title,
          content,
          username
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
         const { title, category, length } = req.query;
        
         
         let query = {};
         if (title) {
             query.title = { $regex: title, $options: 'i' }; 
         }
         if (category) {
            query.category = category;
        }
        if (length) {
            query.content = { $regex: `.{${length},}` }; 
        }

        const notes = await Note.find(query);
        res.json(notes);
    } catch (error) {
        console.error('Failed to fetch filtered notes:', error);
        res.status(500).json({ message: 'Failed to fetch filtered notes' });
    }
  });


  app.put('/api/edit/:noteId', async (req, res) => {
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
