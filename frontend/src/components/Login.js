// src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';

function Login({ setUser }) {
  const [username, setUsernameInput] = useState('');
  const [password, setPasswordInput] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      const token = response.data.token;
      // 保存 token 到本地存储
      localStorage.setItem('token', token);
      setUser({ username });
      // 重定向到主页或其他操作
    } catch (error) {
      alert('登录失败：' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2>登录</h2>
      <input onChange={(e) => setUsernameInput(e.target.value)} placeholder="用户名" />
      <input type="password" onChange={(e) => setPasswordInput(e.target.value)} placeholder="密码" />
      <button onClick={handleLogin}>登录</button>
    </div>
  );
}

export default Login;
