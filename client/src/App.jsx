import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = '/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    mssv: '',
    name: '',
    email: ''
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
      fetchStudents();
      setFormData({ mssv: '', name: '', email: '' });
    } catch (error) {
      console.error('Lỗi khi thêm sinh viên:', error);
      alert('Thêm thất bại! Vui lòng kiểm tra lại kết nối Backend.');
    }
  };

  const handleEdit = async (student) => {
    const newName = prompt('Nhập tên mới cho sinh viên:', student.name);
    if (!newName || newName === student.name) return;

    try {
      await axios.put(`${API_URL}/${student._id}`, {
        studentId: student.studentId || student.mssv,
        name: newName,
        email: student.email
      });
      alert('Cập nhật thành công!');
      fetchStudents();
    } catch (error) {
      console.error('Lỗi khi cập nhật sinh viên:', error);
      alert('Cập nhật thất bại!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert('Xóa sinh viên thành công!');
        fetchStudents();
      } catch (error) {
        console.error('Lỗi khi xóa sinh viên:', error);
        alert('Xóa thất bại!');
      }
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>Quản lý sinh viên - Phiên bản 2.0 (v2.0)</h1>

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
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {students.map((st) => (
              <tr key={st._id}>
                <td>{st.studentId || st.mssv}</td>
                <td>{st.name}</td>
                <td>{st.email}</td>
                <td>
                  <button
                    onClick={() => handleEdit(st)}
                    style={{ padding: '6px 12px', marginRight: '8px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(st._id)}
                    style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;