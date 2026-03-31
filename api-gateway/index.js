const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

const PORT = 3000;

// ─── Service Registry ─────────────────────────────────────────────────────────
const SERVICES = {
  airlines:   'http://localhost:3001',
  flights:    'http://localhost:3002',
  passengers: 'http://localhost:3003',
  baggages:   'http://localhost:3004',
  gates:      'http://localhost:3005',
  staff:      'http://localhost:3006',
};

// ─── Proxy Routes ─────────────────────────────────────────────────────────────
app.use('/api/airlines', createProxyMiddleware({
  target: SERVICES.airlines,
  changeOrigin: true,
  pathRewrite: {
    '^/api/airlines': '/airlines'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.originalUrl} → ${SERVICES.airlines}${req.url}`);
    if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error('Airline proxy error:', err.message);
    res.status(503).json({ error: 'Airline service unavailable' });
  },
}));

app.use('/api/flights', createProxyMiddleware({
  target: SERVICES.flights,
  changeOrigin: true,
  pathRewrite: {
    '^/api/flights': '/flights'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.originalUrl} → ${SERVICES.flights}${req.url}`);
    if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error('Flight proxy error:', err.message);
    res.status(503).json({ error: 'Flight service unavailable' });
  },
}));

app.use('/api/passengers', createProxyMiddleware({
  target: SERVICES.passengers,
  changeOrigin: true,
  pathRewrite: {
    '^/api/passengers': '/passengers'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.originalUrl} → ${SERVICES.passengers}${req.url}`);
    if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error('Passenger proxy error:', err.message);
    res.status(503).json({ error: 'Passenger service unavailable' });
  },
}));

app.use('/api/baggages', createProxyMiddleware({
  target: SERVICES.baggages,
  changeOrigin: true,
  pathRewrite: {
    '^/api/baggages': '/baggages'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.originalUrl} → ${SERVICES.baggages}${req.url}`);
    if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error('Baggage proxy error:', err.message);
    res.status(503).json({ error: 'Baggage service unavailable' });
  },
}));

app.use('/api/gates', createProxyMiddleware({
  target: SERVICES.gates,
  changeOrigin: true,
  pathRewrite: {
    '^/api/gates': '/gates'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.originalUrl} → ${SERVICES.gates}${req.url}`);
    if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error('Gate proxy error:', err.message);
    res.status(503).json({ error: 'Gate service unavailable' });
  },
}));

app.use('/api/staff', createProxyMiddleware({
  target: SERVICES.staff,
  changeOrigin: true,
  pathRewrite: {
    '^/api/staff': '/staff'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.originalUrl} → ${SERVICES.staff}${req.url}`);
    if (req.body && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error('Staff proxy error:', err.message);
    res.status(503).json({ error: 'Staff service unavailable' });
  },
}));

// ─── Aggregated Swagger UI ────────────────────────────────────────────────────
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Airport Management System - API Gateway',
    version: '1.0.0',
    description: 'Unified API Gateway for all Airport microservices. All endpoints accessible via port 3000.',
  },
  servers: [{ url: `http://localhost:${PORT}/api` }],
  tags: [
    { name: 'Airlines',   description: 'Airline management (proxied to :3001)' },
    { name: 'Flights',    description: 'Flight management (proxied to :3002)' },
    { name: 'Passengers', description: 'Passenger management (proxied to :3003)' },
    { name: 'Baggages',   description: 'Baggage management (proxied to :3004)' },
    { name: 'Gates',      description: 'Gate management (proxied to :3005)' },
    { name: 'Staff',      description: 'Staff management (proxied to :3006)' },
  ],
  paths: {
    // ── Airlines ──
    '/airlines': {
      get:  { tags: ['Airlines'], summary: 'Get all airlines', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Airlines'], summary: 'Add an airline', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, code: { type: 'string' }, country: { type: 'string' }, contact: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' } } },
    },
    '/airlines/{id}': {
      get:    { tags: ['Airlines'], summary: 'Get airline by ID', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Success' } } },
      put:    { tags: ['Airlines'], summary: 'Update airline',    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } }, responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Airlines'], summary: 'Delete airline',    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
    },
    // ── Flights ──
    '/flights': {
      get:  { tags: ['Flights'], summary: 'Get all flights', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Flights'], summary: 'Add a flight (id auto-generated)', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['flightNumber', 'airlineId', 'from', 'to', 'departure', 'arrival', 'date'], properties: { flightNumber: { type: 'string' }, airlineId: { type: 'integer' }, from: { type: 'string' }, to: { type: 'string' }, departure: { type: 'string' }, arrival: { type: 'string' }, date: { type: 'string' }, status: { type: 'string', enum: ['On Time', 'Delayed', 'Cancelled', 'Boarding'], description: 'Optional: defaults to "On Time"' } } } } } }, responses: { 201: { description: 'Created' } } },
    },
    '/flights/{id}': {
      get:    { tags: ['Flights'], summary: 'Get flight by ID', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Success' } } },
      put:    { tags: ['Flights'], summary: 'Update flight',    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { flightNumber: { type: 'string' }, airlineId: { type: 'integer' }, from: { type: 'string' }, to: { type: 'string' }, departure: { type: 'string' }, arrival: { type: 'string' }, date: { type: 'string' }, status: { type: 'string', enum: ['On Time', 'Delayed', 'Cancelled', 'Boarding'] } } } } } }, responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Flights'], summary: 'Delete flight',    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/flights/{id}/status': {
      patch: { tags: ['Flights'], summary: 'Update flight status', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['On Time', 'Delayed', 'Cancelled', 'Boarding'] } } } } } }, responses: { 200: { description: 'Updated' } } },
    },
    '/flights/status/{status}': {
      get: { tags: ['Flights'], summary: 'Get flights by status', parameters: [{ in: 'path', name: 'status', required: true, schema: { type: 'string', enum: ['On Time', 'Delayed', 'Cancelled', 'Boarding'] } }], responses: { 200: { description: 'Success' } } },
    },
    // ── Passengers ──
    '/passengers': {
      get:  { tags: ['Passengers'], summary: 'Get all passengers', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Passengers'], summary: 'Check in passenger', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, passport: { type: 'string' }, nationality: { type: 'string' }, flightId: { type: 'integer' }, seat: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' } } },
    },
    '/passengers/{id}': {
      get:    { tags: ['Passengers'], summary: 'Get passenger by ID', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Success' } } },
      put:    { tags: ['Passengers'], summary: 'Update passenger',    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } }, responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Passengers'], summary: 'Remove passenger',    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/passengers/{id}/status': {
      patch: { tags: ['Passengers'], summary: 'Update passenger status', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['Pending', 'Checked In', 'Boarded', 'Cancelled'] } } } } } }, responses: { 200: { description: 'Updated' } } },
    },
    '/passengers/flight/{flightId}': {
      get: { tags: ['Passengers'], summary: 'Get passengers by flight', parameters: [{ in: 'path', name: 'flightId', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Success' } } },
    },
    // ── Baggages ──
    '/baggages': {
      get:  { tags: ['Baggages'], summary: 'Get all baggages', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Baggages'], summary: 'Add baggage', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { tagNumber: { type: 'string' }, passengerId: { type: 'integer' }, weight: { type: 'number' }, type: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' } } },
    },
    '/baggages/{id}': {
      get:    { tags: ['Baggages'], summary: 'Get baggage by ID', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Success' } } },
      delete: { tags: ['Baggages'], summary: 'Remove baggage',    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/baggages/{id}/status': {
      patch: { tags: ['Baggages'], summary: 'Update baggage status', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['Pending', 'Loaded', 'In Transit', 'Delivered', 'Lost'] } } } } } }, responses: { 200: { description: 'Updated' } } },
    },
    '/baggages/passenger/{passengerId}': {
      get: { tags: ['Baggages'], summary: 'Get baggages by passenger', parameters: [{ in: 'path', name: 'passengerId', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Success' } } },
    },
    '/baggages/track/{tagNumber}': {
      get: { tags: ['Baggages'], summary: 'Track baggage by tag number', parameters: [{ in: 'path', name: 'tagNumber', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Success' } } },
    },
    // ── Gates ──
    '/gates': {
      get:  { tags: ['Gates'], summary: 'Get all gates', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Gates'], summary: 'Add a gate', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { gateNumber: { type: 'string' }, terminal: { type: 'string' }, flightId: { type: 'integer' }, boardingTime: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' } } },
    },
    '/gates/{id}': {
      get:    { tags: ['Gates'], summary: 'Get gate by ID', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Success' } } },
      put:    { tags: ['Gates'], summary: 'Update gate',    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } }, responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Gates'], summary: 'Delete gate',    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/gates/{id}/status': {
      patch: { tags: ['Gates'], summary: 'Update gate status', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['Open', 'Closed', 'Boarding', 'Final Call'] } } } } } }, responses: { 200: { description: 'Updated' } } },
    },
    '/gates/flight/{flightId}': {
      get: { tags: ['Gates'], summary: 'Get gate by flight', parameters: [{ in: 'path', name: 'flightId', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Success' } } },
    },
    // ── Staff ──
    '/staff': {
      get:  { tags: ['Staff'], summary: 'Get all staff', responses: { 200: { description: 'Success' } } },
      post: { tags: ['Staff'], summary: 'Add staff member', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, role: { type: 'string' }, department: { type: 'string' }, flightId: { type: 'integer' }, shift: { type: 'string' } } } } } }, responses: { 201: { description: 'Created' } } },
    },
    '/staff/{id}': {
      get:    { tags: ['Staff'], summary: 'Get staff by ID', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Success' } } },
      put:    { tags: ['Staff'], summary: 'Update staff',    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } }, responses: { 200: { description: 'Updated' } } },
      delete: { tags: ['Staff'], summary: 'Remove staff',    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Deleted' } } },
    },
    '/staff/{id}/status': {
      patch: { tags: ['Staff'], summary: 'Update staff status', parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', enum: ['Active', 'Inactive', 'On Leave'] } } } } } }, responses: { 200: { description: 'Updated' } } },
    },
    '/staff/flight/{flightId}': {
      get: { tags: ['Staff'], summary: 'Get staff by flight', parameters: [{ in: 'path', name: 'flightId', required: true, schema: { type: 'integer' } }], responses: { 200: { description: 'Success' } } },
    },
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'API Gateway is running',
    port: PORT,
    services: Object.entries(SERVICES).map(([name, url]) => ({ name, url })),
    swaggerDocs: `http://localhost:${PORT}/api-docs`,
  });
});

// ─── Root ─────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '✈️ Airport Management System - API Gateway',
    endpoints: {
      health:     '/health',
      swagger:    '/api-docs',
      airlines:   '/api/airlines',
      flights:    '/api/flights',
      passengers: '/api/passengers',
      baggages:   '/api/baggages',
      gates:      '/api/gates',
      staff:      '/api/staff',
    },
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✈️  Airport Management API Gateway running on http://localhost:${PORT}`);
  console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
  console.log(`\nRouting:`);
  console.log(`  /api/airlines   → Airline Service   (port 3001)`);
  console.log(`  /api/flights    → Flight Service    (port 3002)`);
  console.log(`  /api/passengers → Passenger Service (port 3003)`);
  console.log(`  /api/baggages   → Baggage Service   (port 3004)`);
  console.log(`  /api/gates      → Gate Service      (port 3005)`);
  console.log(`  /api/staff      → Staff Service     (port 3006)\n`);
});