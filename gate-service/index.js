const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3005;

// ─── Sample Data ─────────────────────────────────────────────────────────────
let gates = [
  { id: 1, gateNumber: 'G01', terminal: 'A', flightId: 1, boardingTime: '07:30', status: 'Open' },
  { id: 2, gateNumber: 'G02', terminal: 'A', flightId: 2, boardingTime: '13:30', status: 'Closed' },
  { id: 3, gateNumber: 'G03', terminal: 'B', flightId: 3, boardingTime: '21:30', status: 'Open' },
];
let nextId = 4;

// ─── Swagger Setup ────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gate Service API',
      version: '1.0.0',
      description: 'Manages gates in the Airport Management System',
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
 * /gates:
 *   get:
 *     summary: Get all gates
 *     tags: [Gates]
 *     responses:
 *       200:
 *         description: List of all gates
 */
app.get('/gates', (req, res) => {
  res.json(gates);
});

/**
 * @swagger
 * /gates/{id}:
 *   get:
 *     summary: Get gate by ID
 *     tags: [Gates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gate found
 *       404:
 *         description: Gate not found
 */
app.get('/gates/:id', (req, res) => {
  const gate = gates.find(g => g.id === parseInt(req.params.id));
  if (!gate) return res.status(404).json({ message: 'Gate not found' });
  res.json(gate);
});

/**
 * @swagger
 * /gates/flight/{flightId}:
 *   get:
 *     summary: Get gate assigned to a flight
 *     tags: [Gates]
 *     parameters:
 *       - in: path
 *         name: flightId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gate found
 *       404:
 *         description: No gate assigned
 */
app.get('/gates/flight/:flightId', (req, res) => {
  const gate = gates.find(g => g.flightId === parseInt(req.params.flightId));
  if (!gate) return res.status(404).json({ message: 'No gate assigned to this flight' });
  res.json(gate);
});

/**
 * @swagger
 * /gates:
 *   post:
 *     summary: Add a new gate
 *     tags: [Gates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [gateNumber, terminal, flightId, boardingTime]
 *             properties:
 *               gateNumber:
 *                 type: string
 *               terminal:
 *                 type: string
 *               flightId:
 *                 type: integer
 *               boardingTime:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gate added
 */
app.post('/gates', (req, res) => {
  const { gateNumber, terminal, flightId, boardingTime } = req.body;
  if (!gateNumber || !terminal || !flightId || !boardingTime)
    return res.status(400).json({ message: 'All fields are required' });
  const gate = { id: nextId++, gateNumber, terminal, flightId, boardingTime, status: 'Open' };
  gates.push(gate);
  res.status(201).json(gate);
});

/**
 * @swagger
 * /gates/{id}/status:
 *   patch:
 *     summary: Update gate status
 *     tags: [Gates]
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
 *                 enum: [Open, Closed, Boarding, Final Call]
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Gate not found
 */
app.patch('/gates/:id/status', (req, res) => {
  const idx = gates.findIndex(g => g.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Gate not found' });
  gates[idx].status = req.body.status;
  res.json(gates[idx]);
});

/**
 * @swagger
 * /gates/{id}:
 *   put:
 *     summary: Update gate details
 *     tags: [Gates]
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
 *               gateNumber:
 *                 type: string
 *               terminal:
 *                 type: string
 *               flightId:
 *                 type: integer
 *               boardingTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gate updated
 *       404:
 *         description: Gate not found
 */
app.put('/gates/:id', (req, res) => {
  const idx = gates.findIndex(g => g.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Gate not found' });
  gates[idx] = { ...gates[idx], ...req.body };
  res.json(gates[idx]);
});

/**
 * @swagger
 * /gates/{id}:
 *   delete:
 *     summary: Delete a gate
 *     tags: [Gates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gate deleted
 *       404:
 *         description: Gate not found
 */
app.delete('/gates/:id', (req, res) => {
  const idx = gates.findIndex(g => g.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Gate not found' });
  gates.splice(idx, 1);
  res.json({ message: 'Gate deleted successfully' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Gate Service running on http://localhost:${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});