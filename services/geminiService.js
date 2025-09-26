const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function createAnalysisPrompt(code, language, problemTitle) {
  return `You are an expert software engineer specializing in algorithm analysis and code optimization. 

Analyze the following ${language} code${problemTitle ? ` for the problem "${problemTitle}"` : ''} and provide a comprehensive complexity analysis.

CODE TO ANALYZE:
\`\`\`${language}
${code}
\`\`\`

Please provide your analysis in the following JSON format (respond ONLY with valid JSON):

{
  "timeComplexity": {
    "bigO": "O(...)",
    "explanation": "Detailed explanation of time complexity analysis",
    "bestCase": "O(...)",
    "averageCase": "O(...)",
    "worstCase": "O(...)"
  },
  "spaceComplexity": {
    "bigO": "O(...)",
    "explanation": "Detailed explanation of space complexity analysis",
    "auxiliary": "O(...)",
    "total": "O(...)"
  },
  "algorithmType": "Type of algorithm (e.g., Two Pointers, Dynamic Programming, etc.)",
  "dataStructures": ["List of data structures used"],
  "optimizationLevel": "Poor/Fair/Good/Excellent",
  "suggestions": [
    {
      "type": "performance|readability|memory",
      "description": "Specific optimization suggestion",
      "impact": "Expected improvement"
    }
  ],
  "strengths": ["List of code strengths"],
  "weaknesses": ["List of potential issues"],
  "alternativeApproaches": [
    {
      "approach": "Alternative algorithm name",
      "timeComplexity": "O(...)",
      "spaceComplexity": "O(...)",
      "tradeoffs": "When to use this approach"
    }
  ],
  "scalability": {
    "rating": "Poor/Fair/Good/Excellent",
    "analysis": "How well the solution scales with input size"
  },
  "codeQuality": {
    "readability": "Poor/Fair/Good/Excellent",
    "maintainability": "Poor/Fair/Good/Excellent",
    "comments": "Assessment of code documentation"
  }
}

Important guidelines:
- Provide precise Big O notation
- Explain your reasoning clearly
- Consider all loops, recursive calls, and data structure operations
- Account for hidden complexities in built-in functions
- Be specific about optimization opportunities
- Consider edge cases and input constraints`;
}

function parseGeminiResponse(responseText) {
  try {
    let cleanText = responseText.trim();
    
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    const analysis = JSON.parse(cleanText);
    
    const requiredFields = ['timeComplexity', 'spaceComplexity', 'algorithmType'];
    for (const field of requiredFields) {
      if (!analysis[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    return {
      timeComplexity: analysis.timeComplexity,
      spaceComplexity: analysis.spaceComplexity,
      algorithmType: analysis.algorithmType,
      dataStructures: analysis.dataStructures || [],
      optimizationLevel: analysis.optimizationLevel || 'Unknown',
      suggestions: analysis.suggestions || [],
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],
      alternativeApproaches: analysis.alternativeApproaches || [],
      scalability: analysis.scalability || { rating: 'Unknown', analysis: 'Not analyzed' },
      codeQuality: analysis.codeQuality || { 
        readability: 'Unknown', 
        maintainability: 'Unknown', 
        comments: 'Not assessed' 
      }
    };
    
  } catch (error) {
    console.error('Failed to parse Gemini response:', error.message);
    
    return {
      timeComplexity: {
        bigO: "Unable to analyze",
        explanation: "The analysis could not be completed due to parsing issues."
      },
      spaceComplexity: {
        bigO: "Unable to analyze",
        explanation: "The analysis could not be completed due to parsing issues."
      },
      algorithmType: "Unknown",
      dataStructures: [],
      optimizationLevel: "Unknown",
      suggestions: [{
        type: "general",
        description: "Manual review recommended - automated analysis failed",
        impact: "Unknown"
      }],
      strengths: [],
      weaknesses: ["Automated analysis failed"],
      alternativeApproaches: [],
      scalability: { rating: "Unknown", analysis: "Could not be analyzed" },
      codeQuality: { 
        readability: "Unknown", 
        maintainability: "Unknown", 
        comments: "Could not be assessed" 
      }
    };
  }
}

async function analyzeCodeComplexity(code, language = 'unknown', problemTitle = '') {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    
    const prompt = createAnalysisPrompt(code, language, problemTitle);
    
    const generationConfig = {
      temperature: 0.1,
      topK: 1,
      topP: 0.8,
      maxOutputTokens: 2048,
    };
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });
    
    const response = await result.response;
    const responseText = response.text();
    
    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }
    
    const analysis = parseGeminiResponse(responseText);
    return analysis;
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Check for API key issues
    if (error.message.includes('API key') || error.message.includes('API_KEY')) {
      throw new Error('Invalid or missing Gemini API key');
    }
    
    // Check for rate limit/quota issues
    if (error.message.includes('quota') || 
        error.message.includes('rate limit') ||
        error.message.includes('RATE_LIMIT_EXCEEDED') ||
        error.message.includes('429') ||
        error.status === 429 ||
        error.code === 429) {
      const rateLimitError = new Error('Gemini API rate limit exceeded');
      rateLimitError.status = 429;
      rateLimitError.code = 'RATE_LIMIT_EXCEEDED';
      throw rateLimitError;
    }
    
    // Check for timeout issues
    if (error.message.includes('timeout') || 
        error.message.includes('TIMEOUT') ||
        error.code === 'TIMEOUT') {
      const timeoutError = new Error('Gemini API request timeout');
      timeoutError.status = 504;
      timeoutError.code = 'TIMEOUT';
      throw timeoutError;
    }
    
    // Check for server errors from Gemini
    if (error.status >= 500 || error.message.includes('server error')) {
      const serverError = new Error('Gemini API server error');
      serverError.status = 502;
      serverError.code = 'UPSTREAM_ERROR';
      throw serverError;
    }
    
    // Generic error
    const genericError = new Error(`Analysis failed: ${error.message}`);
    genericError.status = 500;
    genericError.originalError = error;
    throw genericError;
  }
}

async function testConnection() {
  try {
    const testCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`;
    
    const result = await analyzeCodeComplexity(testCode, 'javascript', 'Fibonacci Test');
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  analyzeCodeComplexity,
  testConnection
};