const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// ─── Sample Data ─────────────────────────────────────────────────────────────
let airlines = [
  { id: 1, name: 'SriLankan Airlines', code: 'UL', country: 'Sri Lanka', contact: 'info@srilankan.com' },
  { id: 2, name: 'Emirates', code: 'EK', country: 'UAE', contact: 'info@emirates.com' },
  { id: 3, name: 'FitsAir', code: 'FZ', country: 'Sri Lanka', contact: 'info@fitsair.com' },
];
let nextId = 4;

// ─── Swagger Setup ────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Airline Service API',
      version: '1.0.0',
      description: 'Manages airlines in the Airport Management System',
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
 * /airlines:
 *   get:
 *     summary: Get all airlines
 *     tags: [Airlines]
 *     responses:
 *       200:
 *         description: List of all airlines
 */
app.get('/airlines', (req, res) => {
  res.json(airlines);
});

/**
 * @swagger
 * /airlines/{id}:
 *   get:
 *     summary: Get airline by ID
 *     tags: [Airlines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Airline found
 *       404:
 *         description: Airline not found
 */
app.get('/airlines/:id', (req, res) => {
  const airline = airlines.find(a => a.id === parseInt(req.params.id));
  if (!airline) return res.status(404).json({ message: 'Airline not found' });
  res.json(airline);
});

/**
 * @swagger
 * /airlines:
 *   post:
 *     summary: Add a new airline
 *     tags: [Airlines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code, country, contact]
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               country:
 *                 type: string
 *               contact:
 *                 type: string
 *     responses:
 *       201:
 *         description: Airline added
 */
app.post('/airlines', (req, res) => {
  const { name, code, country, contact } = req.body;
  if (!name || !code || !country || !contact)
    return res.status(400).json({ message: 'All fields are required' });
  const airline = { id: nextId++, name, code, country, contact };
  airlines.push(airline);
  res.status(201).json(airline);
});

/**
 * @swagger
 * /airlines/{id}:
 *   put:
 *     summary: Update an airline
 *     tags: [Airlines]
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
 *               code:
 *                 type: string
 *               country:
 *                 type: string
 *               contact:
 *                 type: string
 *     responses:
 *       200:
 *         description: Airline updated
 *       404:
 *         description: Airline not found
 */
app.put('/airlines/:id', (req, res) => {
  const idx = airlines.findIndex(a => a.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Airline not found' });
  airlines[idx] = { ...airlines[idx], ...req.body };
  res.json(airlines[idx]);
});

/**
 * @swagger
 * /airlines/{id}:
 *   delete:
 *     summary: Delete an airline
 *     tags: [Airlines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Airline deleted
 *       404:
 *         description: Airline not found
 */
app.delete('/airlines/:id', (req, res) => {
  const idx = airlines.findIndex(a => a.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Airline not found' });
  airlines.splice(idx, 1);
  res.json({ message: 'Airline deleted successfully' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Airline Service running on http://localhost:${PORT}`);
  console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
});