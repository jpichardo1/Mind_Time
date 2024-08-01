import React, { useState, useEffect } from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../TaskForm.css'; 

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
    <form className="task-form-custom" onSubmit={handleSubmit}>
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
        timeFormat="hh:mm aa" 
        timeIntervals={15}
        dateFormat="yyyy-MM-dd hh:mm aa"
        placeholderText="Start Date (YYYY-MM-DD hh:mm aa)"
        className="react-datepicker-custom"
      />
      <DatePicker
        selected={taskData.end}
        onChange={(date) => setTaskData({ ...taskData, end: date })}
        showTimeSelect
        timeFormat="hh:mm aa" 
        timeIntervals={15}
        dateFormat="yyyy-MM-dd hh:mm aa" 
        placeholderText="End Date (YYYY-MM-DD hh:mm aa)"
        className="react-datepicker-custom"
      />
      <button type="submit">Save Task</button>
    </form>
  );
};

export default TaskForm;
