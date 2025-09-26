const express = require('express');
const { analyzeCodeComplexity } = require('../services/geminiService');

const router = express.Router();

const validateAnalyzeRequest = (req, res, next) => {
  const { code, language, problemTitle } = req.body;
  
  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      error: 'Invalid input',
      message: 'Code is required and must be a string'
    });
  }
  
  if (code.trim().length === 0) {
    return res.status(400).json({
      error: 'Invalid input',
      message: 'Code cannot be empty'
    });
  }
  
  if (code.length > 50000) {
    return res.status(400).json({
      error: 'Invalid input',
      message: 'Code is too long. Maximum 50,000 characters allowed.'
    });
  }
  
  const supportedLanguages = [
    'javascript', 'python', 'java', 'cpp', 'c', 'csharp', 
    'go', 'rust', 'typescript', 'php', 'ruby', 'swift', 'kotlin'
  ];
  
  if (language && !supportedLanguages.includes(language.toLowerCase())) {
    return res.status(400).json({
      error: 'Invalid input',
      message: `Language '${language}' is not supported. Supported languages: ${supportedLanguages.join(', ')}`
    });
  }
  
  req.body.code = code.trim();
  req.body.language = language ? language.toLowerCase() : 'unknown';
  req.body.problemTitle = problemTitle ? problemTitle.trim() : '';
  
  next();
};

router.post('/analyze', validateAnalyzeRequest, async (req, res) => {
  try {
    const { code, language, problemTitle } = req.body;
    
    const analysis = await analyzeCodeComplexity(code, language, problemTitle);
    
    res.status(200).json({
      success: true,
      data: {
        analysis,
        metadata: {
          language,
          problemTitle: problemTitle || null,
          codeLength: code.length,
          analyzedAt: new Date().toISOString()
        }
      }
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    
    // Handle rate limit errors (429) - prioritize this check
    if (error.status === 429 || 
        error.code === 'RATE_LIMIT_EXCEEDED' ||
        error.message.includes('rate limit') || 
        error.message.includes('quota') ||
        error.message.includes('429')) {
      return res.status(429).json({
        error: 'Rate Limit Exceeded',
        message: 'Gemini API rate limit exceeded. Please try again later.',
        retryAfter: 60, // Suggest retry after 60 seconds
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }
    
    // Handle API key configuration errors
    if (error.message.includes('API key')) {
      return res.status(500).json({
        error: 'Configuration Error',
        message: 'API service is not properly configured',
        code: 'CONFIG_ERROR'
      });
    }
    
    // Handle timeout errors (504)
    if (error.status === 504 || 
        error.code === 'TIMEOUT' ||
        error.message.includes('timeout')) {
      return res.status(504).json({
        error: 'Gateway Timeout',
        message: 'Analysis took too long. Please try with shorter code.',
        code: 'TIMEOUT'
      });
    }
    
    // Handle upstream server errors (502)
    if (error.status === 502 || error.code === 'UPSTREAM_ERROR') {
      return res.status(502).json({
        error: 'Service Unavailable',
        message: 'Gemini API is temporarily unavailable. Please try again later.',
        code: 'UPSTREAM_ERROR'
      });
    }
    
    // Generic server error (500)
    res.status(500).json({
      error: 'Analysis Failed',
      message: 'Unable to analyze the code. Please try again.',
      code: 'INTERNAL_ERROR'
    });
  }
});

router.get('/status', (req, res) => {
  res.status(200).json({
    service: 'Code Complexity Analyzer',
    status: 'active',
    version: '1.0.0',
    supportedLanguages: [
      'javascript', 'python', 'java', 'cpp', 'c', 'csharp',
      'go', 'rust', 'typescript', 'php', 'ruby', 'swift', 'kotlin'
    ],
    limits: {
      maxCodeLength: 50000,
      rateLimit: '100 requests per 15 minutes'
    }
  });
});

// Test endpoint to simulate rate limit error (for development/testing only)
if (process.env.NODE_ENV === 'development') {
  router.post('/test-rate-limit', (req, res) => {
    return res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: 'Gemini API rate limit exceeded. Please try again later.',
      retryAfter: 60,
      code: 'RATE_LIMIT_EXCEEDED'
    });
  });
}

module.exports = router;