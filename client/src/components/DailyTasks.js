import React from 'react';

function DailyTasks({ tasks }) {
  if (!tasks.length) {
    return <p>No tasks available.</p>;
  }
  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
      ))}
    </div>
  );
}

export default DailyTasks;
