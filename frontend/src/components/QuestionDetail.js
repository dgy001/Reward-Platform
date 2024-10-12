// src/components/QuestionDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClaimTask from './ClaimTask';
import { useParams } from 'react-router-dom';

function QuestionDetail({ user }) {
    const [question, setQuestion] = useState(null);
    const { id } = useParams();
  
    useEffect(() => {
      const fetchQuestion = async () => {
        const result = await axios.get(`http://localhost:5000/api/questions/${id}`);
        setQuestion(result.data);
      };
      fetchQuestion();
    }, [id]);
  return (
    <div>
      {question && (
        <>
          <h1>{question.title}</h1>
          <p>{question.description}</p>
          {user && <ClaimTask questionId={question.id} userId={user.id} />}
        </>
      )}
    </div>
  );
}

export default QuestionDetail;
