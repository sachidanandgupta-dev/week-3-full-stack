const router = require('express').Router();
const Task = require('../models/Task');
const protect = require('../middleware/auth');

router.use(protect);

// GET /api/tasks?status=&priority=&search=
router.get('/', async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    res.json(await Task.find(filter).sort({ createdAt: -1 }));
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ message: 'Title is required' });
    const task = await Task.create({ user: req.user._id, title, description, status, priority, dueDate: dueDate || undefined });
    res.status(201).json(task);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    if (title !== undefined && !title.trim()) return res.status(400).json({ message: 'Title cannot be empty' });
    const update = { title, description, status, priority };
    if (dueDate !== undefined) update.dueDate = dueDate || null;
    Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      update,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
