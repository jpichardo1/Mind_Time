import React from 'react';
import EntryCard from './EntryCard';

function DailyEntries({ entries }) {
  if (!entries.length) {
    return <p>No entries available.</p>;
  }
  return (
    <div>
      {entries.map(entry => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}

export default DailyEntries;
