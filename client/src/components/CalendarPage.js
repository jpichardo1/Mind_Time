import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TaskForm from './TaskForm';
import moment from 'moment';
import { useAuth } from './AuthContext'; // Import useAuth hook

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function CalendarPage() {
  const { isLoggedIn } = useAuth(); // Get authentication status
  const history = useHistory();
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({ description: "", start: null, end: null });

  useEffect(() => {
    if (!isLoggedIn) {
      history.push('/login');
      return;
    }

    async function fetchTasks() {
      try {
        const response = await fetch('/tasks', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
          const formattedEvents = data.map(task => ({
            title: task.description,
            start: new Date(task.start),
            end: new Date(task.end),
            id: task.id,
          }));
          setEvents(formattedEvents);
        } else {
          console.error('Failed to fetch tasks:', response.status);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    fetchTasks();
  }, [isLoggedIn, history]);

  const handleAddTask = async () => {
    const formattedTask = {
      description: newTask.description,
      start: newTask.start ? moment(newTask.start).format('YYYY-MM-DD HH:mm:ss') : null,
      end: newTask.end ? moment(newTask.end).format('YYYY-MM-DD HH:mm:ss') : null,
      completed: false,
    };

    try {
      const response = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formattedTask),
      });

      if (response.ok) {
        const newTaskData = await response.json();
        setTasks([...tasks, newTaskData]);
        setEvents([...events, {
          title: newTaskData.description,
          start: new Date(newTaskData.start),
          end: new Date(newTaskData.end),
          id: newTaskData.id,
        }]);
        setNewTask({ description: "", start: null, end: null });
      } else {
        console.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async (task) => {
    const formattedTask = {
      ...task,
      start: task.start ? moment(task.start).format('YYYY-MM-DD HH:mm:ss') : '',
      end: task.end ? moment(task.end).format('YYYY-MM-DD HH:mm:ss') : '',
    };

    try {
      const response = await fetch(`/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formattedTask),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        setEvents(events.map(e => e.id === updatedTask.id ? {
          ...e,
          title: updatedTask.description,
          start: new Date(updatedTask.start),
          end: new Date(updatedTask.end),
        } : e));
        setSelectedTask(null);
      } else {
        console.error('Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== taskId));
        setEvents(events.filter(event => event.id !== taskId));
        setSelectedTask(null);
      } else {
        console.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSelectEvent = (event) => {
    const task = tasks.find(task => task.id === event.id);
    setSelectedTask(task);
  };

  if (!isLoggedIn) {
    return <p>Redirecting to login...</p>;
  }

  return (
    <div>
      <h1>Calendar</h1>
      <h2>Add New Task</h2>
      <div>
        <input
          type="text"
          placeholder="Add Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <DatePicker
          placeholderText="Start Date"
          selected={newTask.start}
          onChange={(start) => setNewTask({ ...newTask, start })}
          showTimeSelect
          timeFormat="hh:mm aa"
          timeIntervals={15}
          dateFormat="yyyy-MM-dd hh:mm aa"
        />
        <DatePicker
          placeholderText="End Date"
          selected={newTask.end}
          onChange={(end) => setNewTask({ ...newTask, end })}
          showTimeSelect
          timeFormat="hh:mm aa"
          timeIntervals={15}
          dateFormat="yyyy-MM-dd hh:mm aa"
        />
        <button onClick={handleAddTask}>
          Add Task
        </button>
      </div>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px" }}
        views={['month', 'week', 'day', 'agenda']}
        step={30} // Minutes in each step
        timeslots={2} // Number of slots per step
        onSelectEvent={handleSelectEvent}
      />
      {selectedTask && (
        <>
          <TaskForm
            onSave={handleEditTask}
            task={selectedTask}
          />
          <button onClick={() => handleDeleteTask(selectedTask.id)}>Delete Task</button>
        </>
      )}
    </div>
  );
}

export default CalendarPage;
