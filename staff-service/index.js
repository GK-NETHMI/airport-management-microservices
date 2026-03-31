const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3006;

// ─── Sample Data ─────────────────────────────────────────────────────────────
let staff = [
  { id: 1, name: 'Kamal Perera', role: 'Ground Crew', department: 'Operations', flightId: 1, shift: 'Morning', status: 'Active' },
  { id: 2, name: 'Nimal Silva', role: 'Check-in Agent', department: 'Passenger Services', flightId: 2, shift: 'Afternoon', status: 'Active' },
  { id: 3, name: 'Saman Fernando', role: 'Security Officer', department: 'Security', flightId: null, shift: 'Night', status: 'Active' },
];
let nextId = 4;

// ─── Swagger Setup ────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Staff Service API',
      version: '1.0.0',
      description: 'Manages staff in the Airport Management System',
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ['./index.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /staff:
 *   get:
 *     summary: Get all staff
 *     tags: [Staff]
 *     responses:
 *       200:
 *         description: List of all staff
 */
app.get('/staff', (req, res) => {
  res.json(staff);
});

/**
 * @swagger
 * /staff/{id}:
 *   get:
 *     summary: Get staff by ID
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Staff found
 *       404:
 *         description: Staff not found
 */
app.get('/staff/:id', (req, res) => {
  const member = staff.find(s => s.id === parseInt(req.params.id));
  if (!member) return res.status(404).json({ message: 'Staff not found' });
  res.json(member);
});

/**
 * @swagger
 * /staff/flight/{flightId}:
 *   get:
 *     summary: Get all staff assigned to a flight
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: flightId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Staff assigned to flight
 */
app.get('/staff/flight/:flightId', (req, res) => {
  const result = staff.filter(s => s.flightId === parseInt(req.params.flightId));
  res.json(result);
});

/**
 * @swagger
 * /staff:
 *   post:
 *     summary: Add a new staff member
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, role, department, shift]
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               department:
 *                 type: string
 *               flightId:
 *                 type: integer
 *               shift:
 *                 type: string
 *                 enum: [Morning, Afternoon, Night]
 *     responses:
 *       201:
 *         description: Staff member added
 */
app.post('/staff', (req, res) => {
  const { name, role, department, flightId, shift } = req.body;
  if (!name || !role || !department || !shift)
    return res.status(400).json({ message: 'name, role, department and shift are required' });
  const member = { id: nextId++, name, role, department, flightId: flightId || null, shift, status: 'Active' };
  staff.push(member);
  res.status(201).json(member);
});

/**
 * @swagger
 * /staff/{id}:
 *   put:
 *     summary: Update staff member
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               department:
 *                 type: string
 *               flightId:
 *                 type: integer
 *               shift:
 *                 type: string
 *                 enum: [Morning, Afternoon, Night]
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive, On Leave]
 *     responses:
 *       200:
 *         description: Staff updated
 *       404:
 *         description: Staff not found
 */
app.put('/staff/:id', (req, res) => {
  const idx = staff.findIndex(s => s.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Staff not found' });
  staff[idx] = { ...staff[idx], ...req.body };
  res.json(staff[idx]);
});

/**
 * @swagger
 * /staff/{id}/status:
 *   patch:
 *     summary: Update staff status
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive, On Leave]
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Staff not found
 */
app.patch('/staff/:id/status', (req, res) => {
  const idx = staff.findIndex(s => s.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Staff not found' });
  staff[idx].status = req.body.status;
  res.json(staff[idx]);
});

/**
 * @swagger
 * /staff/{id}:
 *   delete:
 *     summary: Remove a staff member
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Staff removed
 *       404:
 *         description: Staff not found
 */
app.delete('/staff/:id', (req, res) => {
  const idx = staff.findIndex(s => s.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Staff not found' });
  staff.splice(idx, 1);
  res.json({ message: 'Staff member removed successfully' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Staff Service running on http://localhost:${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});