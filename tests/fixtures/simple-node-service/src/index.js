const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);
});

app.post('/api/users', (req, res) => {
  const user = req.body;
  res.status(201).json({ id: 3, ...user });
});

app.listen(port, () => {
  console.log(`Service listening on port ${port}`);
});
