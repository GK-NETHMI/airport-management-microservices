const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3004;

// ─── Sample Data ─────────────────────────────────────────────────────────────
let baggages = [
  { id: 1, tagNumber: 'BIA00101', passengerId: 1, weight: 23, type: 'Check-in', status: 'Loaded' },
  { id: 2, tagNumber: 'BIA00102', passengerId: 2, weight: 18, type: 'Check-in', status: 'Loaded' },
  { id: 3, tagNumber: 'BIA00103', passengerId: 3, weight: 30, type: 'Check-in', status: 'Pending' },
];
let nextId = 4;

// ─── Swagger Setup ────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Baggage Service API',
      version: '1.0.0',
      description: 'Manages baggage in the Airport Management System',
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
 * /baggages:
 *   get:
 *     summary: Get all baggages
 *     tags: [Baggages]
 *     responses:
 *       200:
 *         description: List of all baggages
 */
app.get('/baggages', (req, res) => {
  res.json(baggages);
});

/**
 * @swagger
 * /baggages/{id}:
 *   get:
 *     summary: Get baggage by ID
 *     tags: [Baggages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Baggage found
 *       404:
 *         description: Baggage not found
 */
app.get('/baggages/:id', (req, res) => {
  const baggage = baggages.find(b => b.id === parseInt(req.params.id));
  if (!baggage) return res.status(404).json({ message: 'Baggage not found' });
  res.json(baggage);
});

/**
 * @swagger
 * /baggages/passenger/{passengerId}:
 *   get:
 *     summary: Get all baggages for a specific passenger
 *     tags: [Baggages]
 *     parameters:
 *       - in: path
 *         name: passengerId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Baggages for the passenger
 */
app.get('/baggages/passenger/:passengerId', (req, res) => {
  const result = baggages.filter(b => b.passengerId === parseInt(req.params.passengerId));
  res.json(result);
});

/**
 * @swagger
 * /baggages/track/{tagNumber}:
 *   get:
 *     summary: Track baggage by tag number
 *     tags: [Baggages]
 *     parameters:
 *       - in: path
 *         name: tagNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Baggage found
 *       404:
 *         description: Baggage not found
 */
app.get('/baggages/track/:tagNumber', (req, res) => {
  const baggage = baggages.find(b => b.tagNumber === req.params.tagNumber);
  if (!baggage) return res.status(404).json({ message: 'Baggage not found' });
  res.json(baggage);
});

/**
 * @swagger
 * /baggages:
 *   post:
 *     summary: Add new baggage
 *     tags: [Baggages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tagNumber, passengerId, weight, type]
 *             properties:
 *               tagNumber:
 *                 type: string
 *               passengerId:
 *                 type: integer
 *               weight:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [Check-in, Carry-on]
 *     responses:
 *       201:
 *         description: Baggage added
 */
app.post('/baggages', (req, res) => {
  const { tagNumber, passengerId, weight, type } = req.body;
  if (!tagNumber || !passengerId || !weight || !type)
    return res.status(400).json({ message: 'All fields are required' });
  const baggage = { id: nextId++, tagNumber, passengerId, weight, type, status: 'Pending' };
  baggages.push(baggage);
  res.status(201).json(baggage);
});

/**
 * @swagger
 * /baggages/{id}/status:
 *   patch:
 *     summary: Update baggage status
 *     tags: [Baggages]
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
 *                 enum: [Pending, Loaded, In Transit, Delivered, Lost]
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Baggage not found
 */
app.patch('/baggages/:id/status', (req, res) => {
  const idx = baggages.findIndex(b => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Baggage not found' });
  baggages[idx].status = req.body.status;
  res.json(baggages[idx]);
});

/**
 * @swagger
 * /baggages/{id}:
 *   delete:
 *     summary: Remove baggage
 *     tags: [Baggages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Baggage removed
 *       404:
 *         description: Baggage not found
 */
app.delete('/baggages/:id', (req, res) => {
  const idx = baggages.findIndex(b => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Baggage not found' });
  baggages.splice(idx, 1);
  res.json({ message: 'Baggage removed successfully' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Baggage Service running on http://localhost:${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});