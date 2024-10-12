// src/components/QuestionList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const result = await axios.get('http://localhost:5000/api/questions');
      setQuestions(result.data);
    };
    fetchQuestions();
  }, []);

  const handleLike = async (id) => {
    await axios.post(`http://localhost:5000/api/questions/${id}/like`);
    // 更新点赞数
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, likes: q.likes + 1 } : q))
    );
  };

  return (
    <div>
      <h2>问题列表</h2>
      {questions.map((q) => (
        <div key={q.id}>
          <Link to={`/questions/${q.id}`}>
            <h3>{q.title}</h3>
          </Link>
          <p>点赞数：{q.likes}</p>
          <button onClick={() => handleLike(q.id)}>点赞</button>
        </div>
      ))}
    </div>
  );
}

export default QuestionList;
