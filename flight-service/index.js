const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;

// ─── Sample Data ─────────────────────────────────────────────────────────────
let flights = [
  { id: 1, flightNumber: 'UL123', airlineId: 1, from: 'Colombo', to: 'Dubai', departure: '08:00', arrival: '11:00', date: '2026-04-01', status: 'On Time' },
  { id: 2, flightNumber: 'EK270', airlineId: 2, from: 'Colombo', to: 'London', departure: '14:00', arrival: '20:00', date: '2026-04-01', status: 'On Time' },
  { id: 3, flightNumber: 'UL224', airlineId: 1, from: 'Colombo', to: 'Singapore', departure: '22:00', arrival: '05:00', date: '2026-04-01', status: 'Delayed' },
];
let nextId = 4;

// ─── Swagger Setup ────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flight Service API',
      version: '1.0.0',
      description: 'Manages flights in the Airport Management System',
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
 * /flights:
 *   get:
 *     summary: Get all flights
 *     tags: [Flights]
 *     responses:
 *       200:
 *         description: List of all flights
 */
app.get('/flights', (req, res) => {
  res.json(flights);
});

/**
 * @swagger
 * /flights/{id}:
 *   get:
 *     summary: Get flight by ID
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Flight found
 *       404:
 *         description: Flight not found
 */
app.get('/flights/:id', (req, res) => {
  const flight = flights.find(f => f.id === parseInt(req.params.id));
  if (!flight) return res.status(404).json({ message: 'Flight not found' });
  res.json(flight);
});

/**
 * @swagger
 * /flights/status/{status}:
 *   get:
 *     summary: Get flights by status
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [On Time, Delayed, Cancelled, Boarding]
 *     responses:
 *       200:
 *         description: Flights with given status
 */
app.get('/flights/status/:status', (req, res) => {
  const result = flights.filter(f => f.status === req.params.status);
  res.json(result);
});

/**
 * @swagger
 * /flights:
 *   post:
 *     summary: Add a new flight
 *     tags: [Flights]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [flightNumber, airlineId, from, to, departure, arrival, date]
 *             properties:
 *               flightNumber:
 *                 type: string
 *               airlineId:
 *                 type: integer
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               departure:
 *                 type: string
 *               arrival:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       201:
 *         description: Flight added
 */
app.post('/flights', (req, res) => {
  const { flightNumber, airlineId, from, to, departure, arrival, date } = req.body;
  if (!flightNumber || !airlineId || !from || !to || !departure || !arrival || !date)
    return res.status(400).json({ message: 'All fields are required' });
  const flight = { id: nextId++, flightNumber, airlineId, from, to, departure, arrival, date, status: 'On Time' };
  flights.push(flight);
  res.status(201).json(flight);
});

/**
 * @swagger
 * /flights/{id}/status:
 *   patch:
 *     summary: Update flight status
 *     tags: [Flights]
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
 *                 enum: [On Time, Delayed, Cancelled, Boarding]
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Flight not found
 */
app.patch('/flights/:id/status', (req, res) => {
  const idx = flights.findIndex(f => f.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Flight not found' });
  flights[idx].status = req.body.status;
  res.json(flights[idx]);
});

/**
 * @swagger
 * /flights/{id}:
 *   put:
 *     summary: Update flight details
 *     tags: [Flights]
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
 *               flightNumber:
 *                 type: string
 *               from:
 *                 type: string
 *               to:
 *                 type: string
 *               departure:
 *                 type: string
 *               arrival:
 *                 type: string
 *               date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Flight updated
 *       404:
 *         description: Flight not found
 */
app.put('/flights/:id', (req, res) => {
  const idx = flights.findIndex(f => f.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Flight not found' });
  flights[idx] = { ...flights[idx], ...req.body };
  res.json(flights[idx]);
});

/**
 * @swagger
 * /flights/{id}:
 *   delete:
 *     summary: Delete a flight
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Flight deleted
 *       404:
 *         description: Flight not found
 */
app.delete('/flights/:id', (req, res) => {
  const idx = flights.findIndex(f => f.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Flight not found' });
  flights.splice(idx, 1);
  res.json({ message: 'Flight deleted successfully' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Flight Service running on http://localhost:${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});