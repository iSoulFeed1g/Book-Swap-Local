import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login/Login';
import Signup from './Login/Signup';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Settings from './Pages/Settings';
import CreatePost from './Pages/CreatePost';
import PostDetail from './Pages/PostDetail';
import EditPost from './Pages/EditPost';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/settings' element={<Settings />}></Route>
        <Route path='/create-post' element={<CreatePost />}></Route>
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
