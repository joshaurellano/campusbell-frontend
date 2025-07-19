import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Login';
import Home from './Home';
import Post from './Post';
import Register from './Registration';
import CreatePost from './CreatePost';
import EmailConfirmation from './EmailConfirmation';
import Profile from './Profile';
import TopicPosts from './TopicPosts';
import Messages from './Messages';
import Freedomwall from './Freedomwall';
import ForgotPassword from './ForgotPassword';
import RequestNewOtp from './RequestNewOtp';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login key="login"/>} />
          <Route path='/register' element={<Register key="register"/>} />
          <Route path='/post' element={<CreatePost />} />
          <Route path='/view' element={<Post />} />
          <Route path='/topic' element={<TopicPosts />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/verify' element={<EmailConfirmation />} />
          <Route path='/chat' element={<Messages />} />
          <Route path='/wall' element={<Freedomwall />} />
          <Route path='/password-reset/:token' element={<ForgotPassword />} />
          <Route path='/request-new-otp' element={<RequestNewOtp />} />

        </Routes>
      </Router>
    </>
  )
}

export default App
