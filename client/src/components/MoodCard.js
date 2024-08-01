import React from 'react';
import '../MoodCard.css'; // Import the CSS file

function MoodCard({ mood, onEdit, onDelete }) {
  const formattedDate = mood.date ? new Date(mood.date).toLocaleDateString('en-US') : 'Unknown Date';

  return (
    <div className="mood-card">
      <h3>Mood: {mood.mood}</h3>
      <p>Note: {mood.note}</p>
      <p>Date: {formattedDate}</p>
      <p>Journal: {mood.journal ? mood.journal.title : 'Unknown Journal'}</p>
      <button onClick={() => onEdit(mood)}>Edit Mood</button>
      <button onClick={() => onDelete(mood.id)}>Delete</button>
    </div>
  );
}

export default MoodCard;
