import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from './contexts/UserContext';

function Home() {
    const [notes, setNotes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [noteCategory, setNoteCategory] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState({
        title: '',
        category: '',
        length: 0,
    });

    const { user } = useUser();

    // Function to fetch user's notes
    const fetchNotes = async () => {
        if (user?.username) {
            try {
                const response = await axios.get(`http://localhost:3001/api/notes/${user.username}`);
                setNotes(response.data); 
            } catch (error) {
                console.error('Failed to fetch notes:', error);
            }
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            const response = await axios.delete(`http://localhost:3001/api/notes/${noteId}`);
            if (response.status === 200) {
                alert('Note deleted successfully!');
                fetchNotes(); // Refresh the list of notes after deletion
            } else {
                alert('Failed to delete note.');
            }
        } catch (error) {
            console.error('Failed to delete note:', error);
            alert('Failed to delete note.');
        }
    };

    // Function to open the modal in edit mode
    const handleEditNote = (note) => {
        setCurrentNote(note);
        setNoteTitle(note.title);
        setNoteContent(note.content);
        setIsEditing(true);
        setShowModal(true);
    };

    const fetchFilteredNotes = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/filter', {
                params: {
                    title: filterCriteria.title,
                    category: filterCriteria.category,
                    length: filterCriteria.length
                }
            });
            console.log("status: ", response.status);
            if (response.status == 201 || response.status == 200 ) {
                setNotes(response.data);
                setShowFilterModal(false);
            }
           // Close the filter modal after fetching
        } catch (error) {
          console.error('Failed to fetch filtered notes:', error);
        }
      };
      

    // Fetch notes on component mount and user change
    useEffect(() => {
        fetchNotes();
    }, [user]);

    const handleSaveNote = async () => {
        const noteData = {
            title: noteTitle,
            content: noteContent,
            username: user.username,
            category: noteCategory
        };

        try {
            let response;

            if (isEditing) {
                // Update existing note
                response = await axios.put(`http://localhost:3001/api/edit/${currentNote.noteId}`, noteData);
            } else {
                // Create new note
                response = await axios.post('http://localhost:3001/api/notes', noteData);
            }


            if (response.status === 200 || response.status === 201) {
                alert('Note saved successfully!');
                setShowModal(false); // Close modal upon successful save
                setNoteTitle(''); // Reset note title
                setNoteContent(''); // Reset note content
                setNoteCategory('');
                fetchNotes(); // Refetch notes to include the newly saved note
            } else {
                alert('Failed to save note.');
            }
        } catch (error) {
            console.error('Failed to save note:', error);
            alert('Failed to save note.');
        }
    };

    return (
        <div>
            <h1>Welcome Home, {user?.username}!</h1>
            <button onClick={() => setShowModal(true)}>Create Note</button>
            <button onClick={() => setShowFilterModal(true)}>Filtered Search</button>

            <div>
                {notes.map(note => (
                    <div key={note._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                        <button onClick={() => handleEditNote(note)}>Edit</button>
                        <button onClick={() => handleDeleteNote(note.noteId)} style={{marginLeft: '10px'}}>Delete</button>
                    </div>
                ))}
            </div>
            {showModal && (
                <div style={{ position: 'fixed', top: '20%', left: '30%', backgroundColor: 'white', padding: '20px', zIndex: 100 }}>
                    <input
                        type="text"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        placeholder="Enter note title"
                        style={{ width: '300px', marginBottom: '10px' }}
                    />
                    <input
                        type="text"
                        value={noteCategory}
                        onChange={(e) => setNoteCategory(e.target.value)}
                        placeholder="Enter note category"
                        style={{ width: '300px', marginBottom: '10px' }}
                    />
                    <textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Enter your note content here..."
                        style={{ width: '300px', height: '100px', display: 'block' }}
                    />
                    <br />
                    <button onClick={handleSaveNote}>Save</button>
                    <button onClick={() => setShowModal(false)}>Close</button>
                </div>
            )}

            {showFilterModal && (
            <div style={{ position: 'fixed', top: '20%', left: '30%', backgroundColor: 'white', padding: '20px', zIndex: 100 }}>
                <h2>Filter Notes</h2>
                <input
                type="text"
                value={filterCriteria.title}
                onChange={e => setFilterCriteria({ ...filterCriteria, title: e.target.value })}
                placeholder="Title"
                style={{ display: 'block', margin: '10px 0' }}
                />
                <input
                type="text"
                value={filterCriteria.category}
                onChange={e => setFilterCriteria({ ...filterCriteria, category: e.target.value })}
                placeholder="Category"
                style={{ display: 'block', margin: '10px 0' }}
                />
                <input
                type="number"
                value={filterCriteria.length}
                onChange={e => setFilterCriteria({ ...filterCriteria, length: parseInt(e.target.value) })}
                placeholder="Minimum Length"
                style={{ display: 'block', margin: '10px 0' }}
                />
                <button onClick={fetchFilteredNotes}>Submit</button>
                <button onClick={() => setShowFilterModal(false)}>Close</button>
            </div>
            )}

        </div>
    );
}

export default Home;
