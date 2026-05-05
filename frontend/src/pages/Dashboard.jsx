import { useEffect, useState } from 'react';
import api from '../api';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    api.get('/tasks').then(r => setTasks(r.data));
  }, []);

  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE');
  const done    = tasks.filter(t => t.status === 'DONE');
  const inProg  = tasks.filter(t => t.status === 'IN_PROGRESS');

  return (
    <div>
      <h2>Welcome, {user?.name} ({user?.role})</h2>
      <div style={{ display: 'flex', gap: 16 }}>
        <div><strong>Total</strong><p>{tasks.length}</p></div>
        <div><strong>Done</strong><p>{done.length}</p></div>
        <div><strong>In Progress</strong><p>{inProg.length}</p></div>
        <div><strong>Overdue</strong><p style={{ color: 'red' }}>{overdue.length}</p></div>
      </div>
      <h3>My Tasks</h3>
      {tasks.map(t => (
        <div key={t.id} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <strong>{t.title}</strong> — {t.status}
          {t.dueDate && <span> | Due: {new Date(t.dueDate).toLocaleDateString()}</span>}
        </div>
      ))}
    </div>
  );
}