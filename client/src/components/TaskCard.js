import React from 'react';

function TaskCard({ task, onDelete, onEdit }) {
  return (
    <div className="task-card">
      <p>{task.description}</p>
      <p>{task.completed ? 'Completed' : 'Incomplete'}</p>
      <button onClick={() => onEdit(task)}>Edit</button>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  );
}

export default TaskCard;
