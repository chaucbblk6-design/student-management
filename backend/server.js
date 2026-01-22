const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Đã thêm để mã hóa mật khẩu
require('dotenv').config();
const Student = require("./models/Student");

const app = express();

// 1. CẤU HÌNH CORS
app.use(cors({
  origin: [
    "https://student-management-nine-zeta.vercel.app", 
    "https://student-management-pj8r.vercel.app", 
    "http://localhost:5173"
  ], 
  credentials: true
}));

app.use(express.json());

// 2. HÀM TỰ ĐỘNG TẠO TÀI KHOẢN ADMIN (ĐÃ TỐI ƯU)
const createAdminAccount = async () => {
  try {
    // Tìm theo studentId để tránh trùng lặp
    const adminExists = await Student.findOne({ studentId: "admin" });

    if (!adminExists) {
      // Mã hóa mật khẩu "123" trước khi lưu để khớp với logic đăng nhập bcrypt
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
      console.log("ℹ️ Tài khoản Admin đã tồn tại trong Database.");
    }
  } catch (err) {
    console.error("❌ Lỗi khi tự động tạo Admin:", err.message);
  }
};

// 3. KẾT NỐI MONGODB VÀ CHẠY HÀM TẠO ADMIN
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    createAdminAccount(); 
  })
  .catch(err => console.log('❌ Lỗi kết nối MongoDB:', err));

// 4. KHAI BÁO ROUTERS (Đảm bảo Châu đã có các file này)
app.use('/api/students', require('./routes/students')); 

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server live at port ${PORT}`);
});