const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { protect } = require('../middleware/auth');
const prisma = new PrismaClient();

// Get tasks (for a project or all)
router.get('/', protect, async (req, res) => {
  const { projectId } = req.query;
  const tasks = await prisma.task.findMany({
    where: projectId ? { projectId: +projectId } : {},
    include: { assignee: true, project: true }
  });
  res.json(tasks);
});

// Create task
router.post('/', protect, async (req, res) => {
  const { title, description, projectId, assigneeId, dueDate } = req.body;
  const task = await prisma.task.create({
    data: { title, description, projectId: +projectId, assigneeId: assigneeId ? +assigneeId : null, dueDate: dueDate ? new Date(dueDate) : null }
  });
  res.status(201).json(task);
});

// Update task status
router.patch('/:id', protect, async (req, res) => {
  const task = await prisma.task.update({
    where: { id: +req.params.id },
    data: req.body
  });
  res.json(task);
});

// Delete task
router.delete('/:id', protect, async (req, res) => {
  await prisma.task.delete({ where: { id: +req.params.id } });
  res.json({ message: 'Deleted' });
});

module.exports = router;