import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './component/Signup';
import Login from './component/Login';
import Private from './component/Private';
import { Home } from './pages/home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" component={<Home />} />   
        <Route path="/signup" component={<Signup />} />
        <Route path="/login" component={<Login />} />
        <Route path="/private" component={<Private />} />
      </Routes>
    </Router>
  );
}

export default App;