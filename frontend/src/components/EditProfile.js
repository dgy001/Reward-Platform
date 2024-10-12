// frontend/src/components/EditProfile.js

import React, { useState, useEffect } from 'react';
import api from '../api';

function EditProfile({ currentUser }) {
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    // 获取当前用户资料
    const fetchUser = async () => {
      try {
        const response = await api.get(`/api/users/${currentUser.id}`);
        setAvatar(response.data.avatar || '');
        setBio(response.data.bio || '');
      } catch (error) {
        console.error('获取用户资料失败', error);
      }
    };

    fetchUser();
  }, [currentUser.id]);

  const handleSave = async () => {
    try {
      await api.put(`/api/users/${currentUser.id}`, { avatar, bio });
      alert('资料更新成功！');
      // 重定向到个人主页或其他操作
    } catch (error) {
      console.error('更新资料失败', error);
    }
  };

  return (
    <div>
      <h2>编辑个人资料</h2>
      <div>
        <label>头像URL：</label>
        <input value={avatar} onChange={(e) => setAvatar(e.target.value)} />
      </div>
      <div>
        <label>个人简介：</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <button onClick={handleSave}>保存</button>
    </div>
  );
}

export default EditProfile;
