// backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// 用户注册
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password], function(err) {
    if (err) {
      return res.status(500).send({ message: 'User registration failed.', error: err.message });
    }
    res.status(201).send({ id: this.lastID, username });
  });
});

// 用户登录（简单示例，未使用加密）
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
    if (err) {
      return res.status(500).send({ message: 'Login failed.', error: err.message });
    }
    if (row) {
      res.send({ message: 'Login successful.', user: row });
    } else {
      res.status(401).send({ message: 'Invalid credentials.' });
    }
  });
});

// 提交问题
app.post('/api/questions', (req, res) => {
  const { title, description } = req.body;
  db.run(`INSERT INTO questions (title, description) VALUES (?, ?)`, [title, description], function(err) {
    if (err) {
      return res.status(500).send({ message: 'Failed to submit question.', error: err.message });
    }
    res.status(201).json({ id: this.lastID, title, description });
  });
});

// 获取所有问题
app.get('/api/questions', (req, res) => {
  db.all(`SELECT * FROM questions ORDER BY likes DESC`, [], (err, rows) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to retrieve questions.', error: err.message });
    }
    res.json(rows);
  });
});

// 点赞问题
app.post('/api/questions/:id/like', (req, res) => {
  const id = req.params.id;
  db.run(`UPDATE questions SET likes = likes + 1 WHERE id = ?`, [id], function(err) {
    if (err) {
      return res.status(500).send({ message: 'Failed to like question.', error: err.message });
    }
    res.send({ message: 'Question liked.' });
  });
});

// 获取问题详情
app.get('/api/questions/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM questions WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to retrieve question.', error: err.message });
    }
    res.json(row);
  });
});

// 接任务
app.post('/api/questions/:id/claim', (req, res) => {
  const questionId = req.params.id;
  const { userId } = req.body;
  db.run(`INSERT INTO tasks (questionId, userId) VALUES (?, ?)`, [questionId, userId], function(err) {
    if (err) {
      return res.status(500).send({ message: 'Failed to claim task.', error: err.message });
    }
    res.send({ message: 'Task claimed.', taskId: this.lastID });
  });
});

// 提交链接
app.post('/api/tasks/:id/submit-link', (req, res) => {
  const taskId = req.params.id;
  const { link } = req.body;
  db.run(`UPDATE tasks SET link = ? WHERE id = ?`, [link, taskId], function(err) {
    if (err) {
      return res.status(500).send({ message: 'Failed to submit link.', error: err.message });
    }
    res.send({ message: 'Link submitted.' });
  });
});

// 获取用户任务
app.get('/api/users/:id/tasks', (req, res) => {
  const userId = req.params.id;
  db.all(`SELECT tasks.*, questions.title FROM tasks JOIN questions ON tasks.questionId = questions.id WHERE tasks.userId = ?`, [userId], (err, rows) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to retrieve tasks.', error: err.message });
    }
    res.json(rows);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`后端服务器正在运行，访问地址：http://localhost:${PORT}`);
});

// 引入 bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// 修改注册路由
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 检查用户名是否已存在
    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
      if (err) {
        return res.status(500).send({ message: '服务器错误', error: err.message });
      }
      if (row) {
        return res.status(400).send({ message: '用户名已存在' });
      }

      // 对密码进行哈希处理
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 存储用户信息
      db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, hashedPassword],
        function (err) {
          if (err) {
            return res.status(500).send({ message: '用户注册失败', error: err.message });
          }
          res.status(201).send({ id: this.lastID, username });
        }
      );
    });
  } catch (error) {
    res.status(500).send({ message: '服务器错误', error: error.message });
  }
});

// 引入 jsonwebtoken
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // 应将此密钥存储在环境变量中

// 修改登录路由
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err) {
      return res.status(500).send({ message: '服务器错误', error: err.message });
    }
    if (!user) {
      return res.status(401).send({ message: '用户名或密码错误' });
    }

    // 验证密码
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // 生成 JWT
      const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
      res.send({ message: '登录成功', token });
    } else {
      res.status(401).send({ message: '用户名或密码错误' });
    }
  });
});

// 验证 JWT 的中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // 格式为 "Bearer TOKEN"

  if (!token) {
    return res.status(401).send({ message: '未提供令牌' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send({ message: '令牌无效' });
    }
    req.user = user;
    next();
  });
}



// 提交问题（需要登录）
app.post('/api/questions', authenticateToken, (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.id;

  db.run(
    `INSERT INTO questions (title, description, userId) VALUES (?, ?, ?)`,
    [title, description, userId],
    function (err) {
      if (err) {
        return res.status(500).send({ message: '提交问题失败', error: err.message });
      }
      res.status(201).json({ id: this.lastID, title, description, userId });
    }
  );
});


// 接任务（需要登录）
app.post('/api/questions/:id/claim', authenticateToken, (req, res) => {
  const questionId = req.params.id;
  const userId = req.user.id;

  db.run(
    `INSERT INTO tasks (questionId, userId) VALUES (?, ?)`,
    [questionId, userId],
    function (err) {
      if (err) {
        return res.status(500).send({ message: '接任务失败', error: err.message });
      }
      res.send({ message: '任务已接下', taskId: this.lastID });
    }
  );
});


// 获取用户资料
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  db.get(`SELECT id, username, avatar, bio FROM users WHERE id = ?`, [userId], (err, user) => {
    if (err) {
      return res.status(500).send({ message: '获取用户资料失败', error: err.message });
    }
    if (!user) {
      return res.status(404).send({ message: '用户不存在' });
    }

    // 获取关注和粉丝数
    db.get(`SELECT COUNT(*) as following FROM followers WHERE followerId = ?`, [userId], (err, following) => {
      if (err) {
        return res.status(500).send({ message: '获取关注数失败', error: err.message });
      }

      db.get(`SELECT COUNT(*) as followers FROM followers WHERE userId = ?`, [userId], (err, followers) => {
        if (err) {
          return res.status(500).send({ message: '获取粉丝数失败', error: err.message });
        }

        res.send({
          ...user,
          following: following.following,
          followers: followers.followers
        });
      });
    });
  });
});


// 更新用户资料（需要登录）
app.put('/api/users/:id', authenticateToken, (req, res) => {
  const userId = req.params.id;
  const { avatar, bio } = req.body;

  // 确保只能更新自己的资料
  if (req.user.id != userId) {
    return res.status(403).send({ message: '无权更新他人资料' });
  }

  db.run(`UPDATE users SET avatar = ?, bio = ? WHERE id = ?`, [avatar, bio, userId], function (err) {
    if (err) {
      return res.status(500).send({ message: '更新用户资料失败', error: err.message });
    }
    res.send({ message: '用户资料更新成功' });
  });
});


// 关注用户（需要登录）
app.post('/api/users/:id/follow', authenticateToken, (req, res) => {
  const userId = req.params.id;
  const followerId = req.user.id;

  if (userId == followerId) {
    return res.status(400).send({ message: '不能关注自己' });
  }

  db.run(`INSERT OR IGNORE INTO followers (userId, followerId) VALUES (?, ?)`, [userId, followerId], function (err) {
    if (err) {
      return res.status(500).send({ message: '关注失败', error: err.message });
    }
    res.send({ message: '关注成功' });
  });
});

// 取消关注用户（需要登录）
app.post('/api/users/:id/unfollow', authenticateToken, (req, res) => {
  const userId = req.params.id;
  const followerId = req.user.id;

  db.run(`DELETE FROM followers WHERE userId = ? AND followerId = ?`, [userId, followerId], function (err) {
    if (err) {
      return res.status(500).send({ message: '取消关注失败', error: err.message });
    }
    res.send({ message: '取消关注成功' });
  });
});


// 获取用户的提问列表
app.get('/api/users/:id/questions', (req, res) => {
  const userId = req.params.id;

  db.all(`SELECT * FROM questions WHERE userId = ?`, [userId], (err, questions) => {
    if (err) {
      return res.status(500).send({ message: '获取提问列表失败', error: err.message });
    }
    res.send(questions);
  });
});


