#!/usr/bin/env python3
from flask import Flask, request, make_response, abort, session
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from config import app, db, api
from datetime import datetime
from werkzeug.exceptions import NotFound, Unauthorized
from models import User, Journal, Task, Mood
from sqlalchemy.exc import IntegrityError

# Initialize Flask extensions
CORS(app)
Migrate(app, db)

@app.route('/')
def index():
    return '<h1>Mind_Time</h1>'

class Users(Resource):
    def post(self):
        req_json = request.get_json()
        username = req_json.get('username')
        password_hash = req_json.get('password')

        if not username or not password_hash:
            return make_response({'error': 'Username and password are required'}, 400)

        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return make_response({'error': 'Username already exists'}, 400)

        new_user = User(username=username, password_hash=password_hash)
        db.session.add(new_user)
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return make_response({'error': 'An error occurred while creating the user'}, 500)

        session['user_id'] = new_user.id
        return make_response(new_user.to_dict(), 201)

@app.route('/login', methods=['POST'])
def login():
    req_json = request.get_json()
    username = req_json.get('username')
    password = req_json.get('password')

    if not username or not password:
        return make_response({'error': 'Username and password are required'}, 400)

    user = User.query.filter_by(username=username).first()
    if user and user.authenticate(password):
        session['user_id'] = user.id
        return make_response(user.to_dict(), 200)
    else:
        return make_response({'error': 'Invalid credentials'}, 401)

@app.route('/logout', methods=['DELETE'])
def logout():
    session.clear()
    return make_response({}, 204)

class Journals(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 401)
        journals = Journal.query.filter_by(user_id=user_id).all()
        return make_response([journal.to_dict() for journal in journals], 200)

    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 401)
        req_json = request.get_json()
        new_journal = Journal(content=req_json.get('content'), user_id=user_id)
        db.session.add(new_journal)
        db.session.commit()
        return make_response(new_journal.to_dict(), 201)

class JournalsById(Resource):
    def patch(self, journal_id):
        journal = Journal.query.get(journal_id)
        if not journal:
            return make_response({'error': 'Journal not found'}, 404)
        req_json = request.get_json()
        for key, value in req_json.items():
            setattr(journal, key, value)
        db.session.add(journal)
        db.session.commit()
        return make_response(journal.to_dict(), 200)

    def delete(self, journal_id):
        journal = Journal.query.get(journal_id)
        if not journal:
            return make_response({'error': 'Journal not found'}, 404)
        db.session.delete(journal)
        db.session.commit()
        return make_response({}, 204)

    def get(self, journal_id):
        journal = Journal.query.get(journal_id)
        if not journal:
            return make_response({'error': 'Journal not found'}, 404)
        return make_response(journal.to_dict(), 200)

class Tasks(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 401)
        tasks = Task.query.filter_by(user_id=user_id).all()
        return make_response([task.to_dict() for task in tasks], 200)

    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 401)
        req_json = request.get_json()
        
        try:
            start = datetime.strptime(req_json.get('start'), "%Y-%m-%d %H:%M:%S")
            end = datetime.strptime(req_json.get('end'), "%Y-%m-%d %H:%M:%S")
        except ValueError:
            return make_response({'error': 'Invalid date format'}, 400)

        new_task = Task(
            description=req_json.get('description'),
            completed=req_json.get('completed', False),
            start=start,
            end=end,
            user_id=user_id
        )
        db.session.add(new_task)
        db.session.commit()
        return make_response(new_task.to_dict(), 201)

class TasksById(Resource):
    def patch(self, task_id):
        task = Task.query.get(task_id)
        if not task:
            return make_response({'error': 'Task not found'}, 404)
        req_json = request.get_json()
        for key, value in req_json.items():
            setattr(task, key, value)
        db.session.add(task)
        db.session.commit()
        return make_response(task.to_dict(), 200)

    def delete(self, task_id):
        task = Task.query.get(task_id)
        if not task:
            return make_response({'error': 'Task not found'}, 404)
        db.session.delete(task)
        db.session.commit()
        return make_response({}, 204)

    def get(self, task_id):
        task = Task.query.get(task_id)
        if not task:
            return make_response({'error': 'Task not found'}, 404)
        return make_response(task.to_dict(), 200)

class Moods(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 401)
        moods = Mood.query.filter_by(user_id=user_id).all()
        return make_response([mood.to_dict() for mood in moods], 200)

    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 401)
        req_json = request.get_json()
        
        try:
            date = datetime.fromisoformat(req_json.get('date').replace('Z', '+00:00'))
        except ValueError:
            return make_response({'error': 'Invalid date format'}, 400)

        new_mood = Mood(
            date=date,
            mood=req_json.get('mood'),
            note=req_json.get('note'),
            user_id=user_id
        )
        db.session.add(new_mood)
        db.session.commit()
        return make_response(new_mood.to_dict(), 201)

class MoodsById(Resource):
    def patch(self, mood_id):
        mood = Mood.query.get(mood_id)
        if not mood:
            return make_response({'error': 'Mood not found'}, 404)
        req_json = request.get_json()
        for key, value in req_json.items():
            setattr(mood, key, value)
        db.session.add(mood)
        db.session.commit()
        return make_response(mood.to_dict(), 200)

    def delete(self, mood_id):
        mood = Mood.query.get(mood_id)
        if not mood:
            return make_response({'error': 'Mood not found'}, 404)
        db.session.delete(mood)
        db.session.commit()
        return make_response({}, 204)

    def get(self, mood_id):
        mood = Mood.query.get(mood_id)
        if not mood:
            return make_response({'error': 'Mood not found'}, 404)
        return make_response(mood.to_dict(), 200)

# Add resources to the API
api.add_resource(Users, '/users', '/signup')
api.add_resource(Journals, '/journals')
api.add_resource(Tasks, '/tasks')
api.add_resource(Moods, '/moods')
api.add_resource(JournalsById, '/journals/<int:journal_id>')
api.add_resource(TasksById, '/tasks/<int:task_id>')
api.add_resource(MoodsById, '/moods/<int:mood_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
