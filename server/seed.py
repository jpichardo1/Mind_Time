#!/usr/bin/env python3

# Standard library imports
from datetime import datetime, timezone

# Local imports
from config import app, db, bcrypt
from models import User, Journal, Task, Mood

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")

        # Delete all records from tables
        User.query.delete()
        Journal.query.delete()
        Task.query.delete()
        Mood.query.delete()

        # Create sample users
        user1 = User(username="alice", password_hash=bcrypt.generate_password_hash("password1").decode('utf-8'))
        user2 = User(username="bob", password_hash=bcrypt.generate_password_hash("password2").decode('utf-8'))
        user3 = User(username="charlie", password_hash=bcrypt.generate_password_hash("password3").decode('utf-8'))

        db.session.add_all([user1, user2, user3])
        db.session.commit()

        # Create sample journals
        journal1 = Journal(
            content="Today was a great day!",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
            user_id=user1.id
        )
        journal2 = Journal(
            content="I learned a lot of new things.",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
            user_id=user2.id
        )
        journal3 = Journal(
            content="Feeling grateful for everything.",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
            user_id=user3.id
        )

        db.session.add_all([journal1, journal2, journal3])
        db.session.commit()

        # Create sample tasks
        task1 = Task(
            description="Complete the project report.",
            completed=True,
            user_id=user1.id
        )
        task2 = Task(
            description="Go grocery shopping.",
            completed=False,
            user_id=user2.id
        )
        task3 = Task(
            description="Clean the house.",
            completed=True,
            user_id=user3.id
        )

        db.session.add_all([task1, task2, task3])
        db.session.commit()

        # Create sample moods
        mood1 = Mood(
            date=datetime.now(timezone.utc),
            mood="happy",
            note="Had a great day at work!",
            user_id=user1.id,
            journal_id=journal1.id
        )
        mood2 = Mood(
            date=datetime.now(timezone.utc),
            mood="sad",
            note="Missed my friend's party.",
            user_id=user2.id,
            journal_id=journal2.id
        )
        mood3 = Mood(
            date=datetime.now(timezone.utc),
            mood="excited",
            note="Started a new project!",
            user_id=user3.id,
            journal_id=journal3.id
        )

        db.session.add_all([mood1, mood2, mood3])
        db.session.commit()

        print('Database seeded!')
