import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login/Login';
import Signup from './Login/Signup';
import Onboarding from './Login/Onboarding';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Settings from './Pages/Settings/Settings';
import CreatePost from './Pages/CreatePost';
import PostDetail from './Pages/PostDetail';
import OwnPostDetail from './Pages/OwnPostDetail';
import EditPost from './Pages/EditPost';
import Chat from './Pages/Chat';
import Inbox from './Pages/Inbox';
import Layout from './Pages/Layout';
import Guest from './Pages/Guest';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={user ? <Home /> : <Guest />} />
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path='/home' element={<Home />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/settings' element={<Settings />}></Route>
        <Route path='/create-post' element={<CreatePost />}></Route>
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/own-post/:id" element={<OwnPostDetail />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="/inbox/:email" element={<Inbox />} />
        <Route path="/inbox/:chatId?" element={<Inbox />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/layout" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
