// src/components/SubmitLink.js
import React, { useState } from 'react';
import axios from 'axios';

function SubmitLink({ taskId }) {
  const [link, setLink] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:5000/api/tasks/${taskId}/submit-link`, { link });
      alert('链接提交成功！');
    } catch (error) {
      alert('提交失败：' + error.response.data.message);
    }
  };

  return (
    <div>
      <input onChange={(e) => setLink(e.target.value)} placeholder="解决方案链接" />
      <button onClick={handleSubmit}>提交链接</button>
    </div>
  );
}

export default SubmitLink;
