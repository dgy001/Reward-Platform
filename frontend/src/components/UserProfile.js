// frontend/src/components/UserProfile.js

import React, { useEffect, useState } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';
import UserQuestions from './UserQuestions';


function UserProfile({ currentUser }) {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // 获取用户资料
    const fetchUser = async () => {
      try {
        const response = await api.get(`/api/users/${id}`);
        setUser(response.data);
        
        // 检查当前用户是否已关注该用户
        if (currentUser) {
          const followResponse = await api.get(`/api/users/${id}/isFollowing`);
          setIsFollowing(followResponse.data.isFollowing);
        }
      } catch (error) {
        console.error('获取用户资料失败', error);
      }
    };

    fetchUser();
  }, [id, currentUser]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.post(`/api/users/${id}/unfollow`);
        setIsFollowing(false);
      } else {
        await api.post(`/api/users/${id}/follow`);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('关注操作失败', error);
    }
  };

  if (!user) return <div>加载中...</div>;

  return (
    <div>
      <h2>{user.username}的个人主页</h2>
      <img src={user.avatar || '/default-avatar.png'} alt="头像" width="100" />
      <p>简介：{user.bio || '这个人很懒，什么都没有写。'}</p>
      <p>关注：{user.following} | 粉丝：{user.followers}</p>

      {currentUser && currentUser.id !== parseInt(id) && (
        <button onClick={handleFollow}>{isFollowing ? '取消关注' : '关注'}</button>
      )}

      {currentUser && currentUser.id === parseInt(id) && (
        <button>编辑资料</button>
      )}

      {/* 展示提问列表 */}
      <UserQuestions userId={id} />
    </div>
  );
}

export default UserProfile;
