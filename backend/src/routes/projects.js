const router = require('express').Router();
const { PrismaClient } = require('@prisma/client');
const { protect, adminOnly } = require('../middleware/auth');
const prisma = new PrismaClient();

// Get all projects (user's projects)
router.get('/', protect, async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { members: { some: { userId: req.user.id } } },
    include: { members: { include: { user: true } }, tasks: true }
  });
  res.json(projects);
});

// Create project (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, description, memberIds } = req.body;
  const project = await prisma.project.create({
    data: {
      name,
      description,
      members: {
        create: [
          { userId: req.user.id },
          ...(memberIds || []).map(id => ({ userId: id }))
        ]
      }
    }
  });
  res.status(201).json(project);
});

// Delete project (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await prisma.task.deleteMany({ where: { projectId: +req.params.id } });
  await prisma.projectMember.deleteMany({ where: { projectId: +req.params.id } });
  await prisma.project.delete({ where: { id: +req.params.id } });
  res.json({ message: 'Project deleted' });
});

module.exports = router;