import { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const API_URL = 'http://localhost:5000/api/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Lifecycle Data Ingestion
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_URL);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Controlled Submission Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    
    try {
      const response = await axios.post(API_URL, { title, content });
      // Synchronize local state: prepend new note to reflect chronological order
      setNotes([response.data, ...notes]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  // Interactive Deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      // Reactive UI reconciliation: filter out deleted note immediately
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="container">
      <h1>Notes Management</h1>
      
      <form onSubmit={handleSubmit} className="note-form">
        <input 
          type="text" 
          placeholder="Note Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Detailed body text..." 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
        />
        <button type="submit">Add Note</button>
      </form>

      <div className="notes-list">
        {/* Defensive States */}
        {isLoading && <p className="status-msg">Loading notes...</p>}
        
        {!isLoading && notes.length === 0 && (
          <p className="status-msg">No notes yet — add one above!</p>
        )}

        {!isLoading && notes.map((note) => (
          <div key={note._id} className="note-card">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <div className="note-footer">
              <small>{new Date(note.createdAt).toLocaleString()}</small>
              <button onClick={() => handleDelete(note._id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;