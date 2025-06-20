import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Login from './Login';
import Home from './Home';
import Post from './Post';
import Register from './Registration';
import CreatePost from './CreatePost';
import EmailConfirmation from './EmailConfirmation';
import Profile from './Profile';
import TopicPosts from './TopicPosts';
import Messages from './Messages';

function App() {
  return (
    <>
      <Router>
        <Routes>
        <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login key="login"/>} />
          <Route path='/post' element={<CreatePost />} />
          <Route path='/view' element={<Post />} />
          <Route path='/topic' element={<TopicPosts />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/verify' element={<EmailConfirmation />} />
          <Route path='/chat' element={<Messages />} />
          <Route path='/register' element={<Register key="register"/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
