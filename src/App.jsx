import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Login from './Login';
import Home from './Home';
import Post from './Post';
import Register from './Registration';
import CreatePost from './CreatePost';


function App() {
  return (
    <>
      <Router>
        <Routes>
        <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login key="login"/>} />
          <Route path='/home' element={<Home />} />
          <Route path='/post' element={<CreatePost />} />
          <Route path='/view' element={<Post />} />
          <Route path='/register' element={<Register key="register"/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
