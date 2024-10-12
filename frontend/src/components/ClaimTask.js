// src/components/ClaimTask.js
import React from 'react';
import axios from 'axios';

function ClaimTask({ questionId, userId }) {
  const handleClaim = async () => {
    try {
      await axios.post(`http://localhost:5000/api/questions/${questionId}/claim`, { userId });
      alert('任务已接下！');
    } catch (error) {
      alert('接任务失败：' + error.response.data.message);
    }
  };

  return <button onClick={handleClaim}>接下任务</button>;
}

export default ClaimTask;

