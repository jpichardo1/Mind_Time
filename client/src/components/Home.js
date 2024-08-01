import React from 'react';
import '../Home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Mind Time</h1>
        <p>Organize your life and reflect on your thoughts in a meaningful way.</p>
      </header>

      <section className="home-content">
        <h2>Our Approach</h2>
        <p>
          Mind Time provides a personalized approach to help you organize your life and reflect on your thoughts. Each user's journey is uniquely tailored to support personal growth and mindfulness.
        </p>
      </section>

      <section className="home-content">
        <h2>Key Features</h2>
        <ul>
          <li>Personalized Journals: Tailored to your specific needs and goals.</li>
          <li>Mood Tracking: Monitor and reflect on your emotional patterns.</li>
        </ul>
      </section>

      <section className="home-facts">
        <h2>Did You Know?</h2>
        <div className="fact-box">
          <h3>Mindfulness Benefits</h3>
          <p>Practicing mindfulness can help reduce stress, improve focus, and enhance emotional regulation.</p>
          <p>Mind Time's tools are designed to integrate seamlessly into your daily life, providing support whenever you need it.</p>
        </div>
        <div className="fact-box">
          <h3>Personal Growth</h3>
          <p>Engaging in self-reflection can foster a deeper understanding of oneself and lead to personal growth.</p>
          <p>Our platform offers insights to help you on your journey to self-discovery and improvement.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
