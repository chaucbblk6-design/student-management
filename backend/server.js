const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
require('dotenv').config();
const Student = require("./models/Student");

const app = express();

// 1. CẤU HÌNH CORS (Để kết nối với Vercel)
app.use(cors({
  origin: [
    "https://student-management-nine-zeta.vercel.app", 
    "https://student-management-pj8r.vercel.app", 
    "http://localhost:5173"
  ], 
  credentials: true
}));

app.use(express.json());



// 3. KẾT NỐI DATABASE
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    createAdminAccount(); 
  })
  .catch(err => console.log('❌ Lỗi kết nối MongoDB:', err));

// 4. ROUTERS
app.use('/api/students', require('./routes/students')); 

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server live at port ${PORT}`);
});