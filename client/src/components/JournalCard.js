import React from 'react';
import '../JournalCard.css'; // Import the CSS file

function JournalCard({ journal, onEdit, onDelete }) {
  // Format the created_at and updated_at dates to show only the date part
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
