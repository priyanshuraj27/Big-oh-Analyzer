# 🔍 Big-O Analyzer - Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Express](https://img.shields.io/badge/Express-4.18+-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**A powerful Node.js/Express backend service that provides intelligent code complexity analysis using Google Gemini AI for browser extensions.**

[🚀 Quick Start](#-quick-start) • [📡 API Docs](#-api-endpoints) • [🔧 Configuration](#-configuration) • [🛡️ Security](#️-security-features)

</div>

---

## ✨ Features

- 🤖 **AI-Powered Analysis** - Leverages Google Gemini AI for comprehensive code complexity evaluation
- ⚡ **Fast & Scalable** - Built with Express.js for high performance  
- 🛡️ **Production Ready** - Includes security, rate limiting, and error handling
- 🌐 **CORS Enabled** - Configured for browser extension integration
- 📊 **Comprehensive Metrics** - Provides time/space complexity, algorithm type, and optimization suggestions
- 🔄 **Easy Deploy** - Ready-to-deploy configuration for various hosting platforms

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Local Development
```bash
# Clone the repository
git clone https://github.com/priyanshuraj27/Big-oh-Analyzer.git
cd Big-oh-Analyzer/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# Start development server
npm run dev
```

### Production
```bash
npm install
npm start
```

## 📡 API Endpoints

### � Health Check
```http
GET /health
```
**Response:** Service status and timestamp

### ℹ️ Service Status  
```http
GET /api/status
```
**Response:** Configuration info and supported languages

### 🧠 Analyze Code
```http
POST /api/analyze
Content-Type: application/json

{
  "code": "function twoSum(nums, target) { /* ... */ }",
  "language": "javascript", 
  "problemTitle": "Two Sum"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "timeComplexity": {
        "bigO": "O(n)",
        "explanation": "Single loop through array"
      },
      "spaceComplexity": {
        "bigO": "O(n)", 
        "explanation": "HashMap stores up to n elements"
      },
      "algorithmType": "Hash Table",
      "optimizationLevel": "Excellent",
      "suggestions": [...],
      "strengths": [...],
      "weaknesses": [...]
    }
  }
}
```

## 🌐 Deployment

This backend can be deployed to any Node.js hosting platform. Here's a general deployment guide:

### Environment Variables Required
| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |
| `NODE_ENV` | Set to `production` | ✅ Yes |
| `PORT` | Server port (auto-set by most platforms) | ⚙️ Platform dependent |

### General Deployment Steps
1. **Prepare Your Code**
   ```bash
   git push origin main
   ```

2. **Platform Setup**
   - Choose your preferred hosting platform (Render, Heroku, Vercel, etc.)
   - Connect your repository
   - Configure build settings for Node.js

3. **Configure Environment**
   - Add the required environment variables
   - Ensure Node.js version 18+ is selected

4. **Deploy**
   - Most platforms will auto-detect the Node.js application
   - The app will be available at your platform's provided URL

## 🔧 Configuration

### Environment Variables
```bash
GEMINI_API_KEY=your_gemini_api_key_here  # Required
PORT=5000                                # Optional (default: 10000)
NODE_ENV=development                     # Optional (development/production)
```

### CORS Settings
- **Development**: Allows `localhost` origins
- **Production**: Restricts to browser extensions only

## 🛡️ Security Features

- 🔒 **Rate Limiting** - 100 requests per 15 minutes per IP
- 🛡️ **Helmet.js** - Security headers protection
- ✅ **Input Validation** - Request sanitization and validation
- 🚨 **Error Handling** - Proper status codes and error messages
- 🔐 **Environment-based CORS** - Production-ready origin restrictions

## 🗂️ Project Structure

```
backend/
├── routes/
│   └── analyze.js          # Analysis endpoint
├── services/
│   └── geminiService.js    # Gemini AI integration
├── server.js               # Express app setup
├── package.json           # Dependencies & scripts
└── README.md              # This file
```

## 📊 Supported Languages

JavaScript • Python • Java • C++ • C • C# • Go • Rust • TypeScript • PHP • Ruby • Swift • Kotlin

## 🔍 Troubleshooting

<details>
<summary><strong>🚨 Common Issues</strong></summary>

### Deployment Fails
- ✅ Check Node.js version (>=18.0.0 required)
- ✅ Ensure all dependencies are in `package.json`
- ✅ Verify deployment configuration is correct for your platform

### API Key Errors  
- ✅ Verify `GEMINI_API_KEY` is set in environment variables
- ✅ Check key validity and quota at [Google AI Studio](https://makersuite.google.com)

### CORS Errors
- ✅ Ensure extension manifest includes deployed URL in `host_permissions`
- ✅ Check production CORS settings in `server.js`

</details>

## 📈 Monitoring & Logs

- **Health Check**: `/health` - Service status monitoring
- **Status Endpoint**: `/api/status` - Configuration and capabilities  
- **Error Logging**: Comprehensive error tracking and reporting
- **Platform Logs**: Access via your hosting platform's dashboard for debugging

## 🔄 Updates & Maintenance

For continuous deployment, push your changes:
```bash
git push origin main
```
Your hosting platform will automatically rebuild and redeploy the service.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- **[Browser Extension](../extension)** - Frontend Chrome/Firefox extension
- **[Demo](https://your-demo-url.com)** - Live demo of the extension

---

<div align="center">

**Made with ❤️ for the coding community**

[⭐ Star this repo](https://github.com/priyanshuraj27/Big-oh-Analyzer) • [🐛 Report Bug](https://github.com/priyanshuraj27/Big-oh-Analyzer/issues) • [✨ Request Feature](https://github.com/priyanshuraj27/Big-oh-Analyzer/issues)

</div>