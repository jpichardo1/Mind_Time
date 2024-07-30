import React, { useState, useEffect } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskForm = ({ task, onSave }) => {
  const [taskData, setTaskData] = useState({
    description: task ? task.description : '',
    start: task ? new Date(task.start) : null,
    end: task ? new Date(task.end) : null,
    id: task ? task.id : undefined,
  });

  useEffect(() => {
    if (task) {
      setTaskData({
        description: task.description,
        start: new Date(task.start),
        end: new Date(task.end),
        id: task.id,
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...taskData,
      start: taskData.start ? moment(taskData.start).format('YYYY-MM-DD HH:mm:ss') : '',
      end: taskData.end ? moment(taskData.end).format('YYYY-MM-DD HH:mm:ss') : '',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={taskData.description}
        onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
        placeholder="Task Description"
        required
      />
      <DatePicker
        selected={taskData.start}
        onChange={(date) => setTaskData({ ...taskData, start: date })}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="yyyy-MM-dd HH:mm:ss"
        placeholderText="Start Date (YYYY-MM-DD HH:mm:ss)"
      />
      <DatePicker
        selected={taskData.end}
        onChange={(date) => setTaskData({ ...taskData, end: date })}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="yyyy-MM-dd HH:mm:ss"
        placeholderText="End Date (YYYY-MM-DD HH:mm:ss)"
      />
      <button type="submit">Save Task</button>
    </form>
  );
};

export default TaskForm;
