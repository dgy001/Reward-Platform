// src/components/SubmitQuestion.js

import React, { useState } from 'react';
import api from '../api';

function SubmitQuestion() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    try {
      await api.post('/api/questions', { title, description });
      alert('问题提交成功！');
      // 重定向或其他操作
    } catch (error) {
      alert('提交失败：' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2>提交问题</h2>
      <input onChange={(e) => setTitle(e.target.value)} placeholder="标题" />
      <textarea onChange={(e) => setDescription(e.target.value)} placeholder="描述" />
      <button onClick={handleSubmit}>提交</button>
    </div>
  );
}

export default SubmitQuestion;
