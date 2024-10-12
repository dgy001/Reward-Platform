// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import SubmitQuestion from './components/SubmitQuestion';
import QuestionList from './components/QuestionList';
import QuestionDetail from './components/QuestionDetail';
import Register from './components/Register';

import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';

function App() {
  const [user, setUser] = useState(null);
// 获取当前用户的信息（例如从本地存储的 token 中解码）
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    // 解码 token，获取用户信息
    const decoded = JSON.parse(atob(token.split('.')[1]));
    setUser({ id: decoded.id, username: decoded.username });
  }
}, []);

  return (
    <Router>
      <div>
        <h1>悬赏问题平台</h1>
        <nav>
          <Link to="/">主页</Link>
          <Link to="/submit">提交问题</Link>
          {user ? (
            <>
              <Link to={`/users/${user.id}`}>个人主页</Link>
              <button onClick={() => { localStorage.removeItem('token'); setUser(null); }}>登出</button>
            </>
          ) : (
            <>
              <Link to="/login">登录</Link>
              <Link to="/register">注册</Link>
            </>
          )}
        </nav>

        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/submit" element={<SubmitQuestion />} />
          <Route path="/questions/:id" element={<QuestionDetail user={user} />} />
          <Route path="/" element={<QuestionList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users/:id" element={<UserProfile currentUser={user} />} />
          {user && (
            <Route path="/edit-profile" element={<EditProfile currentUser={user} />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}


export default App;
