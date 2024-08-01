import React from 'react';
import '../DailyMoods.css';

function DailyMoods({ moods }) {
  if (!moods.length) {
    return <p>No moods available.</p>;
  }

  return (
    <div className="mood-cards-container">
      {moods.map(mood => {
        const formattedDate = new Date(mood.date).toLocaleDateString('en-US');
        return (
          <div key={mood.id} className="mood-card-1">
            <h3>{mood.mood}</h3>
            <p>{mood.note}</p>
            <p>Date: {formattedDate}</p>
          </div>
        );
      })}
    </div>
  );
}

export default DailyMoods;
