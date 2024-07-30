import React from 'react';

function JournalCard({ journal, onEdit, onDelete }) {
  return (
    <div className="journal-card">
      <h3>{journal.title || 'Untitled'}</h3>
      <p>{journal.content}</p>
      <p>Created: {new Date(journal.created_at).toLocaleString()}</p>
      <p>Updated: {new Date(journal.updated_at).toLocaleString()}</p>
      <button onClick={() => onEdit(journal)}>Edit Journal</button>
      <button onClick={() => onDelete(journal.id)}>Delete</button>
    </div>
  );
}

export default JournalCard;
