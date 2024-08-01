import React from 'react';
import '../EntryCard.css';

function EntryCard({ entry }) {
  const formattedCreatedDate = new Date(entry.created_at).toLocaleDateString('en-US');
  const formattedUpdatedDate = new Date(entry.updated_at).toLocaleDateString('en-US');

  return (
    <div className="entry-card">
      <h3>Title: {entry.title || 'No Title'}</h3>
      <p>Entry: {entry.content || 'No Content'}</p>
      <p>Created: {formattedCreatedDate}</p>
      <p>Updated: {formattedUpdatedDate}</p>
    </div>
  );
}

export default EntryCard;
