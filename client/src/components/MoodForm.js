import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function MoodForm({ onSave, mood }) {
  const [moodState, setMoodState] = useState(mood ? mood.mood : '');
  const [note, setNote] = useState(mood ? mood.note : '');
  const [date, setDate] = useState(mood ? new Date(mood.date) : new Date());
  const [journalId, setJournalId] = useState(mood ? mood.journalId : '');
  const [journals, setJournals] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchJournals() {
      try {
        const response = await fetch('/journals');
        const data = await response.json();
        console.log('Fetched journals:', data);
        setJournals(data);
      } catch (error) {
        console.error('Error fetching journals:', error);
        setError('Error fetching journals.');
      }
    }

    fetchJournals();

    if (mood) {
      setMoodState(mood.mood);
      setNote(mood.note);
      setDate(new Date(mood.date));
      setJournalId(mood.journalId || '');
    }
  }, [mood]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedDate = date.toISOString().replace('T', ' ').substring(0, 19);

    try {
      const response = await fetch(mood ? `/moods/${mood.id}` : '/moods', {
        method: mood ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood: moodState, note, date: formattedDate, journal_id:journalId }),
      });

      if (response.ok) {
        const data = await response.json();
        onSave(data);
        setMoodState('');
        setNote('');
        setDate(new Date());
        setJournalId('');
        setError(null);
      } else {
        const errorData = await response.json();
        console.error('Failed to save mood', errorData);
        setError('Failed to save mood.');
      }
    } catch (error) {
      console.error('Error saving mood:', error);
      setError('Error saving mood.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="mood">Mood</label>
        <input
          type="text"
          id="mood"
          value={moodState}
          onChange={(e) => setMoodState(e.target.value)}
          placeholder="Mood"
          required
        />
      </div>
      <div>
        <label htmlFor="note">Note</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note"
        />
      </div>
      <div>
        <label htmlFor="journal">Journal</label>
        <select
          id="journal"
          value={journalId}
          onChange={(e) => setJournalId(e.target.value)}
          required
        >
          <option value="">Select Journal</option>
          {journals.map((journal) => (
            <option key={journal.id} value={journal.id}>
              {journal.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="date">Date</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="yyyy/MM/dd"
          className="date-picker"
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={isSubmitting}>
        {mood ? 'Update' : 'Save'} Mood
      </button>
    </form>
  );
}

export default MoodForm;
