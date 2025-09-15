const { Router } = require('express');
const { query } = require('../db');
const { v4: uuidv4 } = require('uuid');

const router = Router();

// GET all stages
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM "tstages"');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching stages:', err);
    res.status(500).send(err.message);
  }
});

// GET a single stage by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM "tstages" WHERE id = $1', [req.params.id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Stage not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// POST a new stage
router.post('/', async (req, res) => {
  if (!req.body) {
    return res.status(400).send('Request body is missing.');
  }
  const { name, remarks } = req.body;
  try {
    const id = req.body.id || uuidv4();
    await query('INSERT INTO "tstages" (id, name, remarks) VALUES ($1, $2, $3)', [id, name, remarks]);
    res.status(201).send('Stage created');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// PUT (update) a stage
router.put('/:id', async (req, res) => {
  if (!req.body) {
    return res.status(400).send('Request body is missing.');
  }
  const { name, remarks } = req.body;
  try {
    const result = await query('UPDATE "tstages" SET name = $1, remarks = $2 WHERE id = $3', [name, remarks, req.params.id]);
    if (result.rowCount > 0) {
      res.send('Stage updated');
    } else {
      res.status(404).send('Stage not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE a stage
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM "tstages" WHERE id = $1', [req.params.id]);
    if (result.rowCount > 0) {
      res.send('Stage deleted');
    }
    else {
      res.status(404).send('Stage not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;