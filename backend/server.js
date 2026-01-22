const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// CẤU HÌNH QUAN TRỌNG NHẤT: CORS
app.use(cors({
  // Thay link này bằng link Vercel chính thức của bạn (trong ảnh image_64a44d.png)
  origin: ["https://student-management-nine-zeta.vercel.app", "http://localhost:5173"], 
  credentials: true
}));

app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ Lỗi kết nối:', err));

// Các Router của bạn (Ví dụ)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server live at port ${PORT}`);
});