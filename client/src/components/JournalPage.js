import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import JournalList from './JournalList';
import JournalForm from './JournalForm';
import MoodList from './MoodList';
import MoodForm from './MoodForm';
import { useAuth } from './AuthContext'; 
import '../JournalPage.css';

function JournalPage() {
  const { isLoggedIn } = useAuth(); 
  const history = useHistory();
  const [journals, setJournals] = useState([]);
  const [moods, setMoods] = useState([]);
  const [editingJournal, setEditingJournal] = useState(null);
  const [editingMood, setEditingMood] = useState(null);
  const [isAddingJournal, setIsAddingJournal] = useState(false);
  const [isAddingMood, setIsAddingMood] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      history.push('/login');
      return;
    }

    async function fetchData() {
      try {
        const journalResponse = await fetch('/journals');
        const journalData = await journalResponse.json();
        setJournals(Array.isArray(journalData) ? journalData : []);

        const moodResponse = await fetch('/moods');
        const moodData = await moodResponse.json();
        setMoods(Array.isArray(moodData) ? moodData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setJournals([]);
        setMoods([]);
      }
    }
    fetchData();
  }, [isLoggedIn, history]);

  const handleSaveJournal = (newJournal) => {
    if (editingJournal) {
      setJournals(journals.map(journal => (journal.id === newJournal.id ? newJournal : journal)));
    } else {
      setJournals([...journals, newJournal]);
    }
    setEditingJournal(null);
    setIsAddingJournal(false);
  };

  const handleSaveMood = (newMood) => {
    if (editingMood) {
      setMoods(moods.map(mood => (mood.id === newMood.id ? newMood : mood)));
    } else {
      setMoods([...moods, newMood]);
    }
    setEditingMood(null);
    setIsAddingMood(false);
  };

  const handleEditJournal = (journal) => {
    setEditingJournal(journal);
    setIsAddingJournal(true);
  };

  const handleEditMood = (mood) => {
    setEditingMood(mood);
    setIsAddingMood(true);
  };

  const handleDeleteJournal = async (id) => {
    try {
      const response = await fetch(`/journals/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setJournals(journals.filter(journal => journal.id !== id));
      } else {
        console.error('Failed to delete journal entry');
      }
    } catch (error) {
      console.error('Error deleting journal entry:', error);
    }
  };

  const handleDeleteMood = async (id) => {
    try {
      const response = await fetch(`/moods/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMoods(moods.filter(mood => mood.id !== id));
      } else {
        console.error('Failed to delete mood');
      }
    } catch (error) {
      console.error('Error deleting mood:', error);
    }
  };

  if (!isLoggedIn) {
    return <p>Redirecting to login...</p>;
  }

  return (
    <div>
      <h2>Journal Entries</h2>
      <button className="add-button" onClick={() => setIsAddingJournal(true)}>Add Journal</button>
      <JournalList journals={journals} onEdit={handleEditJournal} onDelete={handleDeleteJournal} />
      {isAddingJournal && <JournalForm onSave={handleSaveJournal} journal={editingJournal} />}
      
      <h2>Moods</h2>
      <button className="add-button" onClick={() => setIsAddingMood(true)}>Add Mood</button>
      <MoodList moods={moods} onEdit={handleEditMood} onDelete={handleDeleteMood} />
      {isAddingMood && <MoodForm onSave={handleSaveMood} mood={editingMood} />}
    </div>
  );
}

export default JournalPage;
