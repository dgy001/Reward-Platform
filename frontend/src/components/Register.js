// src/components/Register.js

import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsernameInput] = useState('');
  const [password, setPasswordInput] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/register', { username, password });
      alert('注册成功！请登录。');
      // 重定向到登录页面或其他操作
    } catch (error) {
      alert('注册失败：' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2>注册</h2>
      <input onChange={(e) => setUsernameInput(e.target.value)} placeholder="用户名" />
      <input type="password" onChange={(e) => setPasswordInput(e.target.value)} placeholder="密码" />
      <button onClick={handleRegister}>注册</button>
    </div>
  );
}

export default Register;
