import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const load = () => api.get('/projects').then(r => setProjects(r.data));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/projects', { name, description });
    setName(''); setDescription('');
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    load();
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24 }}>
        <h2>Projects</h2>
        <Link to="/dashboard">← Dashboard</Link>
      </div>

      {user?.role === 'ADMIN' && (
        <form onSubmit={create} style={{ background:'#f9f9f9', padding:16, borderRadius:8, marginBottom:24 }}>
          <h3 style={{ marginTop:0 }}>Create New Project</h3>
          <input placeholder="Project name" value={name} onChange={e => setName(e.target.value)}
            required style={{ display:'block', width:'100%', marginBottom:10, padding:8 }} />
          <input placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)}
            style={{ display:'block', width:'100%', marginBottom:10, padding:8 }} />
          <button type="submit" style={{ padding:'8px 20px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>
            Create Project
          </button>
        </form>
      )}

      {projects.length === 0 && <p style={{ color:'#888' }}>No projects yet.</p>}
      {projects.map(p => (
        <div key={p.id} style={{ border:'1px solid #ddd', borderRadius:8, padding:'16px', marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <strong style={{ fontSize:16 }}>{p.name}</strong>
              {p.description && <p style={{ margin:'4px 0 0', color:'#666', fontSize:14 }}>{p.description}</p>}
              <p style={{ margin:'6px 0 0', fontSize:13, color:'#888' }}>
                {p.tasks?.length || 0} tasks · {p.members?.length || 0} members
              </p>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Link to={`/tasks?projectId=${p.id}`} style={{ padding:'6px 14px', background:'#4f46e5', color:'#fff', borderRadius:6, textDecoration:'none', fontSize:14 }}>
                View Tasks
              </Link>
              {user?.role === 'ADMIN' && (
                <button onClick={() => remove(p.id)} style={{ padding:'6px 14px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:6, cursor:'pointer' }}>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}