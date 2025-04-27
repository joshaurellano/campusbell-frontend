import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Login from './Login';
import Home from './Home';
import Post from './Post';

function App() {
  return (
    <>
      <Router>
        <Routes>
        <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/post' element={<Post />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
