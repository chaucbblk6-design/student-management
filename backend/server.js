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

// 2. HÀM TỰ ĐỘNG TẠO TÀI KHOẢN ADMIN
const createAdminAccount = async () => {
  try {
    const adminExists = await Student.findOne({ studentId: "admin" });

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("123", salt);

      const adminAccount = new Student({
        studentId: "admin",
        fullName: "Hệ Thống Admin",
        email: "admin@educhain.vn",
        password: hashedPassword, 
        role: "admin"
      });

      await adminAccount.save();
      console.log("✅ Đã tạo tài khoản Admin mặc định (admin/123)");
    } else {
      console.log("ℹ️ Tài khoản Admin đã tồn tại.");
    }
  } catch (err) {
    console.error("❌ Lỗi tạo Admin:", err.message);
  }
};

// 3. KẾT NỐI DATABASE
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    createAdminAccount(); 
  })
  .catch(err => console.log('❌ Lỗi kết nối MongoDB:', err));

// 4. ROUTERS
app.use('/api/students', require('./routes/studentRoute'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server live at port ${PORT}`);
});