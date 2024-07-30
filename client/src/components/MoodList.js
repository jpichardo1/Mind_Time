import React from 'react';
import MoodCard from './MoodCard';

function MoodList({ moods, onEdit, onDelete }) {
  if (!Array.isArray(moods) || moods.length === 0) {
    return <p>No moods available.</p>;
  }

  return (
    <div>
      {moods.map((mood) => (
        <MoodCard
          key={mood.id}
          mood={mood}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default MoodList;