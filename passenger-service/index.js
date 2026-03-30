const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3003;

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

// ─── Sample Data ─────────────────────────────────────────────────────────────
let passengers = [
  { id: 1, name: 'Kamal Perera', passport: 'N1234567', nationality: 'Sri Lankan', flightId: 1, seat: '12A', status: 'Checked In' },
  { id: 2, name: 'Nimal Silva', passport: 'N7654321', nationality: 'Sri Lankan', flightId: 1, seat: '12B', status: 'Checked In' },
  { id: 3, name: 'John Smith', passport: 'GB123456', nationality: 'British', flightId: 2, seat: '5C', status: 'Pending' },
];
let nextId = 4;

// ─── Swagger Setup ────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Passenger Service API',
      version: '1.0.0',
      description: 'Manages passengers in the Airport Management System',
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
 * /passengers:
 *   get:
 *     summary: Get all passengers
 *     tags: [Passengers]
 *     responses:
 *       200:
 *         description: List of all passengers
 */
app.get('/passengers', (req, res) => {
  res.json(passengers);
});

/**
 * @swagger
 * /passengers:
 *   post:
 *     summary: Check in a new passenger
 *     tags: [Passengers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, passport, nationality, flightId, seat]
 *             properties:
 *               name:
 *                 type: string
 *               passport:
 *                 type: string
 *               nationality:
 *                 type: string
 *               flightId:
 *                 type: integer
 *               seat:
 *                 type: string
 *     responses:
 *       201:
 *         description: Passenger checked in
 */
app.post('/passengers', (req, res) => {
  const { name, passport, nationality, flightId, seat } = req.body;
  if (!name || !passport || !nationality || !flightId || !seat)
    return res.status(400).json({ message: 'All fields are required' });
  const passenger = { id: nextId++, name, passport, nationality, flightId, seat, status: 'Checked In' };
  passengers.push(passenger);
  res.status(201).json(passenger);
});

/**
 * @swagger
 * /passengers/flight/{flightId}:
 *   get:
 *     summary: Get all passengers for a specific flight
 *     tags: [Passengers]
 *     parameters:
 *       - in: path
 *         name: flightId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Passengers for the flight
 */
app.get('/passengers/flight/:flightId', (req, res) => {
  const result = passengers.filter(p => p.flightId === parseInt(req.params.flightId));
  res.json(result);
});

/**
 * @swagger
 * /passengers/{id}/status:
 *   patch:
 *     summary: Update passenger status
 *     tags: [Passengers]
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
 *                 enum: [Pending, Checked In, Boarded, Cancelled]
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Passenger not found
 */
app.patch('/passengers/:id/status', (req, res) => {
  const idx = passengers.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Passenger not found' });
  passengers[idx].status = req.body.status;
  res.json(passengers[idx]);
});

/**
 * @swagger
 * /passengers/{id}:
 *   get:
 *     summary: Get passenger by ID
 *     tags: [Passengers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Passenger found
 *       404:
 *         description: Passenger not found
 */
app.get('/passengers/:id', (req, res) => {
  const passenger = passengers.find(p => p.id === parseInt(req.params.id));
  if (!passenger) return res.status(404).json({ message: 'Passenger not found' });
  res.json(passenger);
});

/**
 * @swagger
 * /passengers/{id}:
 *   put:
 *     summary: Update passenger details
 *     tags: [Passengers]
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
 *               passport:
 *                 type: string
 *               nationality:
 *                 type: string
 *               seat:
 *                 type: string
 *     responses:
 *       200:
 *         description: Passenger updated
 *       404:
 *         description: Passenger not found
 */
app.put('/passengers/:id', (req, res) => {
  const idx = passengers.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Passenger not found' });
  passengers[idx] = { ...passengers[idx], ...req.body };
  res.json(passengers[idx]);
});

/**
 * @swagger
 * /passengers/{id}:
 *   delete:
 *     summary: Remove a passenger
 *     tags: [Passengers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Passenger removed
 *       404:
 *         description: Passenger not found
 */
app.delete('/passengers/:id', (req, res) => {
  const idx = passengers.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Passenger not found' });
  passengers.splice(idx, 1);
  res.json({ message: 'Passenger removed successfully' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Passenger Service running on http://localhost:${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});