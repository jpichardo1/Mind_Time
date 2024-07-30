import React from 'react';

function EntryCard({ entry }) {
  return (
    <div className="entry-card">
      <h3>{entry.title || 'No Title'}</h3>
      <p>{entry.content || 'No Content'}</p>
      <p>{new Date(entry.created_at).toLocaleString()}</p>
      <p>{new Date(entry.updated_at).toLocaleString()}</p>
    </div>
  );
}

export default EntryCard;
