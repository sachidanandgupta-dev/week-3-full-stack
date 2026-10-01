require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const connectDB = require('./config/db');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/images', require('./routes/images'));

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 2MB or smaller' : err.message;
    return res.status(400).json({ message });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid ID' });
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch((e) => { console.error('DB connection failed:', e.message); process.exit(1); });
