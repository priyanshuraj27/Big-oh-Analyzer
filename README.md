# LeetCode Complexity Analyzer - Backend API

A Node.js/Express backend service that analyzes code complexity using Google Gemini AI.

## 🚀 Quick Start

### Local Development
```bash
npm install
npm run dev
```

### Production
```bash
npm install
npm start
```

## 🌐 Deployment on Render

### Step 1: Prepare Repository
1. Push your code to GitHub/GitLab
2. Ensure all files are committed including `render.yaml`

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your repository
4. Choose the repository with your backend code
5. Render will auto-detect the `render.yaml` configuration

### Step 3: Set Environment Variables
In Render dashboard, add these environment variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `GEMINI_API_KEY` | `your_gemini_api_key` | Your Google Gemini API key |
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Port (auto-set by Render) |

### Step 4: Get Your API URL
After deployment, your API will be available at:
```
https://your-app-name.onrender.com
```

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Service Status
```
GET /api/status
```

### Analyze Code
```
POST /api/analyze
Content-Type: application/json

{
  "code": "function example() { return 'hello'; }",
  "language": "javascript",
  "problemTitle": "Example Problem"
}
```

## 🔧 Configuration

### Environment Variables
- `GEMINI_API_KEY` - Required: Your Google Gemini API key
- `PORT` - Optional: Server port (default: 10000)
- `NODE_ENV` - Optional: Environment mode (development/production)

### CORS Configuration
- **Development**: Allows localhost origins
- **Production**: Restricts to browser extensions only

## 🛡️ Security Features

- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- Input validation and sanitization
- Error handling with appropriate status codes

## 📦 Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **helmet** - Security middleware
- **express-rate-limit** - Rate limiting
- **@google/generative-ai** - Gemini AI integration
- **dotenv** - Environment variables

## 🔍 Troubleshooting

### Common Issues

1. **Deployment fails**
   - Check Node.js version (>=18.0.0 required)
   - Ensure all dependencies are in `package.json`

2. **API key errors**
   - Verify `GEMINI_API_KEY` is set in Render environment variables
   - Check key is valid and has quota

3. **CORS errors**
   - Ensure your extension manifest includes the deployed URL in `host_permissions`

### Logs
Check Render logs in the dashboard for debugging information.

## 📈 Monitoring

The service includes:
- Health check endpoint at `/health`
- Status endpoint at `/api/status`
- Error logging and handling

## 🔄 Updates

To update the deployed service:
1. Push changes to your repository
2. Render will automatically redeploy

---

**Need help?** Check the API status at `/api/status` or health at `/health`