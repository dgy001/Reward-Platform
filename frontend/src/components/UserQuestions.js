// frontend/src/components/UserQuestions.js

import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

function UserQuestions({ userId }) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get(`/api/users/${userId}/questions`);
        setQuestions(response.data);
      } catch (error) {
        console.error('获取提问列表失败', error);
      }
    };

    fetchQuestions();
  }, [userId]);

  return (
    <div>
      <h3>提问历史</h3>
      {questions.map((q) => (
        <div key={q.id}>
          <Link to={`/questions/${q.id}`}>
            <h4>{q.title}</h4>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default UserQuestions;
