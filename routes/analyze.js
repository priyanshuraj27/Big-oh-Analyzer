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
    
    if (error.message.includes('API key')) {
      return res.status(500).json({
        error: 'Configuration Error',
        message: 'API service is not properly configured'
      });
    }
    
    if (error.message.includes('quota') || error.message.includes('rate limit')) {
      return res.status(429).json({
        error: 'Rate Limit Exceeded',
        message: 'API quota exceeded. Please try again later.'
      });
    }
    
    if (error.message.includes('timeout')) {
      return res.status(504).json({
        error: 'Timeout',
        message: 'Analysis took too long. Please try with shorter code.'
      });
    }
    
    res.status(500).json({
      error: 'Analysis Failed',
      message: 'Unable to analyze the code. Please try again.'
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

module.exports = router;