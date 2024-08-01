from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from config import bcrypt, db
from datetime import datetime, timezone
from sqlalchemy.ext.associationproxy import association_proxy

def current_time():
    return datetime.now(timezone.utc)

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    journals = db.relationship('Journal', back_populates='user', cascade='all, delete-orphan')
    tasks = db.relationship('Task', back_populates='user', cascade='all, delete-orphan')
    moods = db.relationship('Mood', back_populates='user', cascade='all, delete-orphan')

    serialize_rules = ('-journals.user', '-tasks.user', '-moods.user', '-moods.journal', '-_password_hash', '-moods.journal')

    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError('Must have a username')
        return username

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')
    
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'<User {self.username}>'

class Journal(db.Model, SerializerMixin):
    __tablename__ = "journals"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=current_time)
    updated_at = db.Column(db.DateTime, default=current_time, onupdate=current_time)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', back_populates='journals')
    moods = db.relationship('Mood', back_populates='journal')
    
    serialize_rules = ('-user.journals', '-moods.journal', '-moods.user')

    @validates('content')
    def validate_content(self, key, content):
        if not content:
            raise ValueError('Must have content')
        return content

    def formatted_created_at(self):
        return self.created_at.strftime("%m/%d/%Y %H:%M")

    def formatted_updated_at(self):
        return self.updated_at.strftime("%m/%d/%Y %H:%M")

    def __repr__(self):
        return f'<Journal {self.id} - {self.content[:20]}>'

class Task(db.Model, SerializerMixin):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.Text, nullable=False)
    completed = db.Column(db.Boolean, default=False)
    start = db.Column(db.DateTime)
    end = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', back_populates='tasks')

    serialize_rules = ('-user.tasks',)

    @validates('description')
    def validate_description(self, key, description):
        if not description:
            raise ValueError('Must have a description')
        return description

    def __repr__(self):
        return f'<Task {self.id} - {self.description[:20]}>'

class Mood(db.Model, SerializerMixin):
    __tablename__ = "moods"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False, default=current_time)
    mood = db.Column(db.String, nullable=False)
    note = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    journal_id = db.Column(db.Integer, db.ForeignKey('journals.id'))

    user = db.relationship('User', back_populates='moods')
    journal = db.relationship('Journal', back_populates='moods')

    serialize_rules = ('-user.moods', '-journal.moods')

    @validates('mood')
    def validate_mood(self, key, mood):
        if not mood:
            raise ValueError('Must have a mood')
        return mood
    
    def formatted_date(self):
        return self.date.strftime("%m/%d/%Y %H:%M")

    def __repr__(self):
        return f'<Mood {self.mood} on {self.date}>'
