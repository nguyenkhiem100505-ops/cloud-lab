import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Tự động lấy domain Codespaces để gọi đúng API Backend (Port 5000)
const backendOrigin = window.location.origin.replace('-5174', '-5000').replace('-5173', '-5000');
const API_URL = `${backendOrigin}/api/students`;

function App() {
  // CÂU 47: Khai báo React State lưu danh sách sinh viên
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // CÂU 48: Khai báo React State quản lý các ô <input> Form (MSSV, Họ tên, Email)
  const [formData, setFormData] = useState({
    mssv: '',
    name: '',
    email: ''
  });

  // CÂU 47: Gọi Axios GET /api/students để lấy danh sách
  const fetchStudents = async () => {
    try {
      const response = await axios.get(API_URL);
      setStudents(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sinh viên:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // CÂU 48: Xử lý sự kiện cập nhật State khi nhập liệu vào <input>
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // CÂU 49: Gọi Axios POST /api/students gửi dữ liệu Form lên API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.mssv || !formData.name || !formData.email) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      await axios.post(API_URL, {
        studentId: formData.mssv,
        name: formData.name,
        email: formData.email
      });
      alert('Thêm sinh viên thành công!');
      fetchStudents(); // Cập nhật lại danh sách hiển thị
      setFormData({ mssv: '', name: '', email: '' }); // Xóa dữ liệu form
    } catch (error) {
      console.error('Lỗi khi thêm sinh viên:', error);
      alert('Thêm thất bại! Vui lòng kiểm tra lại kết nối Backend.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>Quản lý sinh viên</h1>

      {/* CÂU 48: Form nhập MSSV, Họ tên và Email bằng các thành phần <input> */}
      <h3>Thêm sinh viên mới</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          name="mssv"
          placeholder="MSSV"
          value={formData.mssv}
          onChange={handleChange}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <input
          type="text"
          name="name"
          placeholder="Họ tên"
          value={formData.name}
          onChange={handleChange}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Thêm sinh viên
        </button>
      </form>

      {/* CÂU 47: Giao diện hiển thị danh sách sinh viên */}
      <h3>Danh sách sinh viên</h3>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>MSSV</th>
              <th>Họ tên</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((st) => (
              <tr key={st._id}>
                <td>{st.studentId || st.mssv}</td>
                <td>{st.name}</td>
                <td>{st.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;