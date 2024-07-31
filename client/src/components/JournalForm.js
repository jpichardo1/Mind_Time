import React, { useState, useEffect } from 'react';
import '../JournalForm.css'; // Import the CSS file

function JournalForm({ onSave, journal }) {
  const [title, setTitle] = useState(journal ? journal.title : '');
  const [content, setContent] = useState(journal ? journal.content : '');

  useEffect(() => {
    if (journal) {
      setTitle(journal.title);
      setContent(journal.content);
    }
  }, [journal]);

  async function handleSubmit(e) {
    e.preventDefault();
    const method = journal ? 'PATCH' : 'POST';
    const url = journal ? `/journals/${journal.id}` : '/journals';
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (response.ok) {
        const data = await response.json();
        onSave(data);
        setTitle('');
        setContent('');
      } else {
        console.error('Failed to save journal entry');
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Journal Title"
        required
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Journal Content"
        required
      />
      <button type="submit">{journal ? 'Update' : 'Save'} Journal</button>
    </form>
  );
}

export default JournalForm;
