import { useEffect, useState } from 'react';
import api from '../api';
import { Link, useSearchParams } from 'react-router-dom';

export default function Tasks() {
  const [tasks, setTasks]         = useState([]);
  const [projects, setProjects]   = useState([]);
  const [users, setUsers]         = useState([]);
  const [searchParams]            = useSearchParams();
  const projectId                 = searchParams.get('projectId');
  const user                      = JSON.parse(localStorage.getItem('user'));

  const [form, setForm] = useState({ title:'', description:'', projectId: projectId||'', assigneeId:'', dueDate:'' });

  const load = () => {
    const url = projectId ? `/tasks?projectId=${projectId}` : '/tasks';
    api.get(url).then(r => setTasks(r.data));
  };

useEffect(() => {
    const url = projectId ? `/tasks?projectId=${projectId}` : '/tasks';
    api.get(url).then(r => setTasks(r.data));
    api.get('/projects').then(r => setProjects(r.data));
    if (user?.role === 'ADMIN') api.get('/users').then(r => setUsers(r.data));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const create = async (e) => {
    e.preventDefault();
    await api.post('/tasks', form);
    setForm({ title:'', description:'', projectId: projectId||'', assigneeId:'', dueDate:'' });
    load();
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/tasks/${id}`, { status });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete task?')) return;
    await api.delete(`/tasks/${id}`);
    load();
  };

  const statusColor = { TODO:'#f3f4f6', IN_PROGRESS:'#dbeafe', DONE:'#d1fae5', OVERDUE:'#fee2e2' };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24 }}>
        <h2>Tasks {projectId ? `— Project #${projectId}` : ''}</h2>
        <div style={{ display:'flex', gap:12 }}>
          <Link to="/projects">← Projects</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </div>

      <form onSubmit={create} style={{ background:'#f9f9f9', padding:16, borderRadius:8, marginBottom:24 }}>
        <h3 style={{ marginTop:0 }}>New Task</h3>
        <input placeholder="Task title" value={form.title} onChange={e => setForm({...form, title:e.target.value})}
          required style={{ display:'block', width:'100%', marginBottom:10, padding:8 }} />
        <input placeholder="Description (optional)" value={form.description} onChange={e => setForm({...form, description:e.target.value})}
          style={{ display:'block', width:'100%', marginBottom:10, padding:8 }} />
        <select value={form.projectId} onChange={e => setForm({...form, projectId:e.target.value})}
          required style={{ display:'block', width:'100%', marginBottom:10, padding:8 }}>
          <option value="">Select Project</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {user?.role === 'ADMIN' && (
          <select value={form.assigneeId} onChange={e => setForm({...form, assigneeId:e.target.value})}
            style={{ display:'block', width:'100%', marginBottom:10, padding:8 }}>
            <option value="">Assign to (optional)</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        )}
        <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate:e.target.value})}
          style={{ display:'block', width:'100%', marginBottom:10, padding:8 }} />
        <button type="submit" style={{ padding:'8px 20px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>
          Add Task
        </button>
      </form>

      {tasks.length === 0 && <p style={{ color:'#888' }}>No tasks yet.</p>}
      {tasks.map(t => (
        <div key={t.id} style={{ border:'1px solid #ddd', borderRadius:8, padding:'12px 16px', marginBottom:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <strong>{t.title}</strong>
              {t.description && <p style={{ margin:'4px 0', color:'#666', fontSize:14 }}>{t.description}</p>}
              {t.assignee && <p style={{ margin:'4px 0', fontSize:13, color:'#888' }}>👤 {t.assignee.name}</p>}
              {t.dueDate && <p style={{ margin:'4px 0', fontSize:13, color: new Date(t.dueDate)<new Date()?'red':'#888' }}>
                📅 Due: {new Date(t.dueDate).toLocaleDateString()}
              </p>}
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)}
                style={{ padding:'4px 8px', background: statusColor[t.status], borderRadius:6, border:'1px solid #ddd', cursor:'pointer' }}>
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="DONE">DONE</option>
                <option value="OVERDUE">OVERDUE</option>
              </select>
              <button onClick={() => remove(t.id)} style={{ padding:'4px 10px', background:'#fee2e2', color:'#dc2626', border:'none', borderRadius:6, cursor:'pointer' }}>
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}