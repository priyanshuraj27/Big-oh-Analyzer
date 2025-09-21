const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const analyzeRoutes = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 10000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(helmet());

const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? ['chrome-extension://*', 'moz-extension://*']
    : ['chrome-extension://*', 'moz-extension://*', 'http://localhost:*', 'https://localhost:*'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Complexity Analyzer API'
  });
});

app.use('/api', analyzeRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'The requested resource does not exist'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Health check: ${NODE_ENV === 'production' ? `https://your-app.onrender.com/health` : `http://localhost:${PORT}/health`}`);
});

module.exports = app;