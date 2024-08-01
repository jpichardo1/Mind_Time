import React from 'react';
import '../DailyTasks.css'; 

function DailyTasks({ tasks }) {
  if (!tasks.length) {
    return <p>No tasks available.</p>;
  }

  return (
    <div className="daily-tasks">
      {tasks.map(task => (
        <div key={task.id} className="task-card">
          <h3>{task.description || 'No Description'}</h3>
          <p>
            <span>Start:</span> {new Date(task.start).toLocaleDateString('en-US')} at{' '}
            {new Date(task.start).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </p>
          <p>
            <span>End:</span> {new Date(task.end).toLocaleDateString('en-US')} at{' '}
            {new Date(task.end).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </p>
        </div>
      ))}
    </div>
  );
}

export default DailyTasks;
