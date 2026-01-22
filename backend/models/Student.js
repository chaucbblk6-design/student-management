const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. Lấy danh sách sinh viên
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ: " + err.message });
  }
});

// 2. Hàm Đăng nhập (Thay thế đoạn Châu hỏi ở đây)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body; 
    const studentId = username; 

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không chính xác" });
    }

    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET || "bi_mat_quan_ly_sinh_vien",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: student._id,
        studentId: student.studentId,
        fullName: student.fullName,
        role: student.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi đăng nhập: " + err.message });
  }
});

// 3. Xóa sinh viên
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa sinh viên thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi xóa: " + err.message });
  }
});

module.exports = router;