import { useCallback, useEffect, useState } from 'react';
import api, { errMsg } from '../api.js';

const empty = { title: '', description: '', status: 'pending', priority: 'medium', dueDate: '' };
const NEXT = { pending: 'in-progress', 'in-progress': 'completed', completed: 'pending' };

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await api.get('/tasks', { params });
      setTasks(data);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(load, 250); // debounce search typing
    return () => clearTimeout(t);
  }, [load]);

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setError('');
    if (!form.title.trim()) return setError('Title is required');
    try {
      if (editingId) await api.put(`/tasks/${editingId}`, form);
      else await api.post('/tasks', form);
      setForm(empty);
      setEditingId(null);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const startEdit = (t) => {
    setEditingId(t._id);
    setForm({
      title: t.title,
      description: t.description || '',
      status: t.status,
      priority: t.priority,
      dueDate: t.dueDate ? t.dueDate.slice(0, 10) : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cycleStatus = async (t) => {
    try {
      await api.put(`/tasks/${t._id}`, { status: NEXT[t.status] });
      load();
    } catch (e) { setError(errMsg(e)); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      load();
    } catch (e) { setError(errMsg(e)); }
  };

  const setF = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setFilter = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });

  return (
    <>
      <form className="card" onSubmit={onSubmit}>
        <h2>{editingId ? 'Edit task' : 'New task'}</h2>
        {error && <p className="error banner">{error}</p>}
        <input placeholder="Title *" value={form.title} onChange={setF('title')} />
        <textarea placeholder="Description" rows={2} value={form.description} onChange={setF('description')} />
        <div className="row">
          <select value={form.status} onChange={setF('status')}>
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
          <select value={form.priority} onChange={setF('priority')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input type="date" value={form.dueDate} onChange={setF('dueDate')} />
        </div>
        <div className="row">
          <button className="btn">{editingId ? 'Update' : 'Add task'}</button>
          {editingId && (
            <button type="button" className="btn ghost" onClick={() => { setEditingId(null); setForm(empty); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="card">
        <h2>Your tasks</h2>
        <div className="row">
          <input placeholder="Search title…" value={filters.search} onChange={setFilter('search')} />
          <select value={filters.status} onChange={setFilter('status')}>
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
          <select value={filters.priority} onChange={setFilter('priority')}>
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {loading ? <p className="muted">Loading…</p> : tasks.length === 0 ? <p className="muted">No tasks found.</p> : (
          <ul className="list">
            {tasks.map((t) => (
              <li key={t._id} className={t.status === 'completed' ? 'done' : ''}>
                <div className="grow">
                  <strong>{t.title}</strong>
                  {t.description && <p className="muted">{t.description}</p>}
                  <span className={`tag ${t.priority}`}>{t.priority}</span>
                  <span className="tag">{t.status}</span>
                  {t.dueDate && <span className="muted"> Due {new Date(t.dueDate).toLocaleDateString()}</span>}
                </div>
                <button className="btn small" onClick={() => cycleStatus(t)}>Next status</button>
                <button className="btn small ghost" onClick={() => startEdit(t)}>Edit</button>
                <button className="btn small danger" onClick={() => remove(t._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
