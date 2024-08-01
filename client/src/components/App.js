// App.js
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from './NavBar';
import Home from './Home';
import CalendarPage from './CalendarPage';
import JournalPage from './JournalPage';
import DailyPage from './DailyPage';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { AuthProvider } from './AuthContext';
import Logout from './Logout';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <NavBar />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/calendar" component={CalendarPage} />
            <Route path="/journals" component={JournalPage} />
            <Route path="/daily" component={DailyPage} />
            <Route path="/login" component={LoginForm} />
            <Route path="/logout" component={Logout} />
            <Route path="/register" component={RegisterForm} />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
