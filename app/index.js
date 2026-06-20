const express = require('express');
const os = require('os');
const app = express();

app.use(express.json());

// ── Health Check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CloudPipe API is running',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── System Info (shows containerization works) ────────────────
app.get('/info', (req, res) => {
  res.json({
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    memory: {
      total: `${Math.round(os.totalmem() / 1024 / 1024)}MB`,
      free: `${Math.round(os.freemem() / 1024 / 1024)}MB`,
    },
    uptime: `${Math.round(os.uptime())}s`,
    nodeVersion: process.version,
    pid: process.pid,
  });
});

// ── Items API (CRUD) ──────────────────────────────────────────
let items = [
  { id: 1, name: 'Deploy to AWS', status: 'done', priority: 'high' },
  { id: 2, name: 'Setup CI/CD Pipeline', status: 'done', priority: 'high' },
  { id: 3, name: 'Configure Terraform', status: 'done', priority: 'medium' },
  { id: 4, name: 'Add Monitoring', status: 'pending', priority: 'medium' },
  { id: 5, name: 'Write Unit Tests', status: 'pending', priority: 'low' },
];

app.get('/items', (req, res) => {
  const { status, priority } = req.query;
  let result = items;
  if (status) result = result.filter(i => i.status === status);
  if (priority) result = result.filter(i => i.priority === priority);
  res.json({ count: result.length, items: result });
});

app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

app.post('/items', (req, res) => {
  const { name, priority = 'medium' } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const item = { id: items.length + 1, name, status: 'pending', priority };
  items.push(item);
  res.status(201).json(item);
});

app.put('/items/:id', (req, res) => {
  const idx = items.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  items[idx] = { ...items[idx], ...req.body };
  res.json(items[idx]);
});

app.delete('/items/:id', (req, res) => {
  const idx = items.findIndex(i => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  const deleted = items.splice(idx, 1)[0];
  res.json({ message: 'Deleted', item: deleted });
});

// ── Metrics endpoint (for monitoring) ────────────────────────
app.get('/metrics', (req, res) => {
  res.json({
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    totalItems: items.length,
    pendingItems: items.filter(i => i.status === 'pending').length,
    doneItems: items.filter(i => i.status === 'done').length,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`CloudPipe API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
