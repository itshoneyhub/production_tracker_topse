const { query } = require('../db');
const { v4: uuidv4 } = require('uuid');

// GET all projects
async function getProjects(req, res) {
  try {
    const result = await query('SELECT "id", projectno, projectname, customername, "owner", projectdate, targetdate, dispatchmonth, productionstage, "remarks" FROM "tprojects"');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).send(err.message);
  }
}

// GET a single project by ID
async function getProjectById(req, res) {
  try {
    const result = await query('SELECT * FROM "tprojects" WHERE "id" = $1', [req.params.id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Project not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}

// POST a new project
async function createProject(req, res) {
  if (!req.body) {
    return res.status(400).send('Request body is missing.');
  }
  let { projectNo, projectName, customerName, owner, projectDate, targetDate, dispatchMonth, productionstage, remarks } = req.body;

  // Validation
  if (!customerName || !projectName || !projectNo) {
    return res.status(400).send('customerName, projectName, and projectNo are required fields.');
  }

  try {
    // Explicitly generate ID in backend
    const id = uuidv4();

    // Ensure projectNo is a string and generate if not provided
    projectNo = String(projectNo || '').trim();
    projectName = String(projectName || '').trim();
    customerName = String(customerName || '').trim();
    owner = String(owner || '').trim();
    productionstage = String(productionstage || '').trim();
    remarks = String(remarks || '').trim();
    dispatchMonth = String(dispatchMonth || '').trim();

    const result = await query(
      'INSERT INTO "tprojects" ("id", projectno, projectname, customername, "owner", projectdate, targetdate, dispatchmonth, productionstage, "remarks") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [id, projectNo, projectName, customerName, owner, projectDate, targetDate, dispatchMonth, productionstage, remarks]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).send(err.message);
  }
}

// PUT (update) a project
async function updateProject(req, res) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).send('Request body is missing or empty.');
  }

  const projectId = req.params.id;
  const updates = req.body;
  const setClauses = [];
  const queryParams = [];
  let paramIndex = 1;

  const fieldMap = {
    projectNo: 'projectno',
    projectName: 'projectname',
    customerName: 'customername',
    owner: 'owner',
    projectDate: 'projectdate',
    targetDate: 'targetdate',
    dispatchMonth: 'dispatchmonth',
    productionStage: 'productionstage',
    remarks: 'remarks',
  };

  for (const key in updates) {
    if (updates.hasOwnProperty(key) && fieldMap[key]) {
      let value = updates[key];
      setClauses.push(`"${fieldMap[key]}" = $${paramIndex}`);
      queryParams.push(value);
      paramIndex++;
    }
  }

  if (setClauses.length === 0) {
    return res.status(400).send('No valid fields to update.');
  }

  queryParams.push(projectId); // Add project ID as the last parameter

  try {
    const updateQuery = `UPDATE "tprojects" SET ${setClauses.join(', ')} WHERE "id" = $${paramIndex} RETURNING *`;
    console.log('updateQuery:', updateQuery);
    console.log('queryParams:', queryParams);
    const result = await query(updateQuery, queryParams);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Project not found');
    }
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).send(err.message);
  }
}

// DELETE a project
async function deleteProject(req, res) {
  try {
    const result = await query('DELETE FROM "tprojects" WHERE "id" = $1', [req.params.id]);
    if (result.rowCount > 0) {
      res.send('Project deleted');
    } else {
      res.status(404).send('Project not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};