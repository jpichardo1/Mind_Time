import React from 'react';

function MoodCard({ mood, onEdit, onDelete }) {
  let formattedDate = 'Unknown Date';
  if (mood.date) {
    const parsedDate = new Date(mood.date);
    formattedDate = isNaN(parsedDate) ? 'Invalid Date' : parsedDate.toLocaleString();
  }

  return (
    <div className="mood-card">
      <h3>Mood: {mood.mood}</h3>
      <p>Note: {mood.note}</p>
      <p>Recorded at: {formattedDate}</p>
      <button onClick={() => onEdit(mood)}>Edit Mood</button>
      <button onClick={() => onDelete(mood.id)}>Delete</button>
    </div>
  );
}

export default MoodCard;
