// backend/database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// 创建表
db.serialize(() => {
  // 更新用户表
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    avatar TEXT,      -- 新增：头像URL
    bio TEXT          -- 新增：个人简介
  )`);


// 创建问题表
db.run(`CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  likes INTEGER DEFAULT 0,
  userId INTEGER,    -- 新增：提问者ID
  FOREIGN KEY (userId) REFERENCES users(id)
)`);


  // 任务表
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    questionId INTEGER,
    userId INTEGER,
    link TEXT,
    FOREIGN KEY (questionId) REFERENCES questions(id),
    FOREIGN KEY (userId) REFERENCES users(id)
  )`);
  // 创建关注关系表
  db.run(`CREATE TABLE IF NOT EXISTS followers (
    userId INTEGER,
    followerId INTEGER,
    PRIMARY KEY (userId, followerId),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (followerId) REFERENCES users(id)
  )`);
});

module.exports = db;

