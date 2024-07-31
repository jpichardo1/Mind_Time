import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../DailyPage.css';
import DailyEntries from './DailyEntries';
import DailyTasks from './DailyTasks';
import DailyMoods from './DailyMoods';

function DailyPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [fetchDate, setFetchDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const offset = fetchDate.getTimezoneOffset() * 60000;
        const localDate = new Date(fetchDate.getTime() - offset);
        const formattedDate = localDate.toISOString().split('T')[0];

        const entryResponse = await fetch(`/journals?date=${formattedDate}`);
        const entriesData = await entryResponse.json();
        setEntries(Array.isArray(entriesData) ? entriesData : []);

        const taskResponse = await fetch(`/tasks?date=${formattedDate}`);
        const tasksData = await taskResponse.json();
        setTasks(Array.isArray(tasksData) ? tasksData : []);

        const moodResponse = await fetch(`/moods?date=${formattedDate}`);
        const moodsData = await moodResponse.json();
        setMoods(Array.isArray(moodsData) ? moodsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setEntries([]);
        setTasks([]);
        setMoods([]);
      }
    }

    fetchData();
  }, [fetchDate]);

  const handleFindClick = () => {
    setFetchDate(selectedDate);
  };

  return (
    <div>
      <h1>Daily</h1>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        placeholderText="Select Date"
        className="date-picker"
      />
      <button onClick={handleFindClick}>Find</button>
      <section>
        <h2>Journal Entries</h2>
        {entries.length > 0 ? (
          <DailyEntries entries={entries} />
        ) : (
          <p>No journal entries for today.</p>
        )}
      </section>
      <section>
        <h2>Tasks</h2>
        {tasks.length > 0 ? (
          <DailyTasks tasks={tasks} />
        ) : (
          <p>No tasks for today.</p>
        )}
      </section>
      <section>
        <h2>Moods</h2>
        {moods.length > 0 ? (
          <DailyMoods moods={moods} />
        ) : (
          <p>No mood records for today.</p>
        )}
      </section>
    </div>
  );
}

export default DailyPage;
