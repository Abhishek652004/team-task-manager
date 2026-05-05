import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'MEMBER' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/signup', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 24 }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Full Name" value={form.name}
          onChange={e => setForm({...form, name: e.target.value})}
          required style={{ display:'block', width:'100%', marginBottom:12, padding:8 }} />
        <input type="email" placeholder="Email" value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          required style={{ display:'block', width:'100%', marginBottom:12, padding:8 }} />
        <input type="password" placeholder="Password" value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
          required style={{ display:'block', width:'100%', marginBottom:12, padding:8 }} />
        <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
          style={{ display:'block', width:'100%', marginBottom:12, padding:8 }}>
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit" style={{ width:'100%', padding:10, background:'#4f46e5', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>
          Sign Up
        </button>
      </form>
      <p style={{ marginTop:16 }}>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}