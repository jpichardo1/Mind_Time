import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DailyEntries from './DailyEntries';
import DailyTasks from './DailyTasks';
import DailyMoods from './DailyMoods';

function DailyPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  console.log('Selected Date set:', selectedDate);

  const [fetchDate, setFetchDate] = useState(new Date());
  console.log('Fetch Date set:', fetchDate);

  const [entries, setEntries] = useState([]);
  console.log('Entries set:', entries);

  const [tasks, setTasks] = useState([]);
  console.log('Tasks set:', tasks);

  const [moods, setMoods] = useState([]);
  console.log('Moods set:', moods);

  useEffect(() => {
    async function fetchData() {
      try {
        const offset = fetchDate.getTimezoneOffset() * 60000;
        const localDate = new Date(fetchDate.getTime() - offset);
        const formattedDate = localDate.toISOString().split('T')[0];
        console.log('Formatted Date:', formattedDate);

        const entryResponse = await fetch(`/journals?date=${formattedDate}`);
        console.log('Journal entries response:', entryResponse);
        const entriesData = await entryResponse.json();
        console.log('Journal entries data:', entriesData);
        setEntries(Array.isArray(entriesData) ? entriesData : []);
        console.log('Entries updated:', entries);

        const taskResponse = await fetch(`/tasks?date=${formattedDate}`);
        console.log('Tasks response:', taskResponse);
        const tasksData = await taskResponse.json();
        console.log('Tasks data:', tasksData);
        setTasks(Array.isArray(tasksData) ? tasksData : []);
        console.log('Tasks updated:', tasks);

        const moodResponse = await fetch(`/moods?date=${formattedDate}`);
        console.log('Moods response:', moodResponse);
        const moodsData = await moodResponse.json();
        console.log('Moods data:', moodsData);
        setMoods(Array.isArray(moodsData) ? moodsData : []);
        console.log('Moods updated:', moods);
      } catch (error) {
        console.error('Error fetching data:', error);
        setEntries([]);
        console.log('Entries cleared');
        setTasks([]);
        console.log('Tasks cleared');
        setMoods([]);
        console.log('Moods cleared');
      }
    }

    fetchData();
  }, [fetchDate]);

  const handleFindClick = () => {
    setFetchDate(selectedDate);
    console.log('Find button clicked, Fetch Date set to:', selectedDate);
  };

  return (
    <div>
      <h1>Daily</h1>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          console.log('Date selected:', date);
        }}
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
