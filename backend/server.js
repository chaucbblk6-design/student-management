const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const Student = require("./models/Student"); // Đảm bảo đường dẫn tới file Student.js chính xác

const app = express();

// 1. CẤU HÌNH CORS
app.use(cors({
  // Châu nhớ kiểm tra link Vercel mới nhất trong Dashboard Vercel và dán vào đây nhé
  origin: [
    "https://student-management-nine-zeta.vercel.app", 
    "https://student-management-pj8r.vercel.app", // Thêm link mới mình thấy trong ảnh trước của Châu
    "http://localhost:5173"
  ], 
  credentials: true
}));

app.use(express.json());

// 2. HÀM TỰ ĐỘNG TẠO TÀI KHOẢN ADMIN
const createAdminAccount = async () => {
  try {
    // Kiểm tra xem đã có tài khoản admin chưa trong bảng Student
    const adminExists = await Student.findOne({ role: "admin" });

    if (!adminExists) {
      const adminAccount = new Student({
        studentId: "admin",
        fullName: "Hệ Thống Admin",
        email: "admin@educhain.vn",
        password: "123", // Mật khẩu là 123
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
    createAdminAccount(); // Sau khi kết nối thành công thì tạo Admin ngay
  })
  .catch(err => console.log('❌ Lỗi kết nối MongoDB:', err));

// Các Router của bạn
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server live at port ${PORT}`);
});