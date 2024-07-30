import React from 'react';

function DailyMoods({ moods }) {
  if (!moods.length) {
    return <p>No moods available.</p>;
  }

  return (
    <div>
      {moods.map(mood => (
        <div key={mood.id}>
          <h3>{mood.mood}</h3>
          <p>{mood.note}</p>
        </div>
      ))}
    </div>
  );
}

export default DailyMoods;
