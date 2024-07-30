import React from 'react';
import JournalCard from './JournalCard';

function JournalList({ journals, onEdit, onDelete }) {
  return (
    <div>
      {journals.map(journal => (
        <JournalCard key={journal.id} journal={journal} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default JournalList;
