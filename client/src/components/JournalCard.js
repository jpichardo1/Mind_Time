import React from 'react';
import '../JournalCard.css'; 

function JournalCard({ journal, onEdit, onDelete }) {
  const formattedCreatedDate = new Date(journal.created_at).toLocaleDateString('en-US');
  const formattedUpdatedDate = new Date(journal.updated_at).toLocaleDateString('en-US');

  return (
    <div className="journal-card">
      <h3>Title: {journal.title || 'Untitled'}</h3>
      <p>{journal.content}</p>
      <p>Created: {formattedCreatedDate}</p>
      <p>Updated: {formattedUpdatedDate}</p>
      <button onClick={() => onEdit(journal)}>Edit Journal</button>
      <button onClick={() => onDelete(journal.id)}>Delete</button>
    </div>
  );
}

export default JournalCard;
