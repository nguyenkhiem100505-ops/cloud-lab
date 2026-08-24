const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Kết nối MongoDB Atlas
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Kết nối MongoDB Atlas thành công!'))
    .catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// ==========================================
// CÂU 35: Tạo Model Student (Mongoose Schema)
// ==========================================
const studentSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

// Route kiểm tra server
app.get('/api/hello', (req, res) => {
    res.json({ message: "Backend đang hoạt động thành công!" });
});

// ==========================================
// CÂU 36: API GET /api/students - Lấy danh sách sinh viên
// ==========================================
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// CÂU 37: API POST /api/students - Thêm sinh viên mới
// ==========================================
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ==========================================
// CÂU 38: API PUT /api/students/:id - Cập nhật sinh viên
// ==========================================
app.put('/api/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ==========================================
// CÂU 39: API DELETE /api/students/:id - Xóa sinh viên
// ==========================================
app.delete('/api/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đã xóa sinh viên thành công!' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Khởi động Server (Chỉ gọi 1 lần ở cuối file)
app.listen(PORT, () => {
    console.log(`Server Backend đang chạy trên port ${PORT}`);
});