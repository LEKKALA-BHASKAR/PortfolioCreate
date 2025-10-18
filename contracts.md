# API Contracts & Integration Plan

## Backend Architecture

### Environment Variables
- `GEMINI_API_KEY`: AIzaSyATLTT48j7ql_gkFPZ6Z1WXoSZnGXKnmxA
- `MONGO_URL`: mongodb+srv://bassnaidu:Lbn@518@cluster0.o5w4egg.mongodb.net/
- `DB_NAME`: portfolio_generator

### MongoDB Collections

#### 1. portfolios
```json
{
  "_id": "ObjectId",
  "userId": "string (optional for MVP)",
  "name": "string",
  "title": "string",
  "email": "string",
  "phone": "string",
  "about": "string",
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "year": "string",
      "description": "string"
    }
  ],
  "skills": [
    {
      "name": "string",
      "level": "string"
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "technologies": "string",
      "link": "string"
    }
  ],
  "experience": [
    {
      "company": "string",
      "position": "string",
      "duration": "string",
      "description": "string"
    }
  ],
  "selectedTemplate": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

## API Endpoints

### 1. POST /api/enhance-content
**Purpose**: Use Gemini AI to analyze and enhance portfolio content

**Request Body**:
```json
{
  "name": "string",
  "title": "string",
  "about": "string",
  "skills": [{"name": "string"}],
  "projects": [{"title": "string", "description": "string"}],
  "experience": [{"position": "string", "description": "string"}]
}
```

**Response**:
```json
{
  "success": true,
  "enhanced": {
    "about": "AI-enhanced about section",
    "skills": [{"name": "string", "description": "string"}],
    "projects": [{"title": "string", "description": "enhanced description"}]
  },
  "suggestions": ["suggestion1", "suggestion2"]
}
```

**Gemini Prompt Strategy**:
- Analyze professional background from title and experience
- Enhance about section for clarity and impact
- Add context to skills
- Improve project descriptions with quantifiable achievements
- Provide 2-3 actionable suggestions

### 2. POST /api/generate-portfolio
**Purpose**: Save portfolio data and prepare for generation

**Request Body**:
```json
{
  "data": { /* Full portfolio data */ },
  "template": "minimal-professional | creative-bold | tech-modern"
}
```

**Response**:
```json
{
  "success": true,
  "portfolioId": "string",
  "message": "Portfolio generated successfully"
}
```

### 3. GET /api/download-portfolio/{portfolioId}
**Purpose**: Generate and download static HTML/CSS/JS files as ZIP

**Response**: ZIP file containing:
- index.html (complete portfolio HTML)
- styles.css (embedded Tailwind CSS)
- README.md (deployment instructions)

**ZIP Generation Strategy**:
- Use portfolio data to generate complete HTML
- Include inline CSS (Tailwind CDN)
- Add deployment instructions for Vercel/GitHub Pages
- No JavaScript dependencies for static version

### 4. GET /api/portfolio/{portfolioId}
**Purpose**: Retrieve portfolio data for preview

**Response**:
```json
{
  "success": true,
  "portfolio": { /* Complete portfolio object */ }
}
```

## Mock Data to Replace

### In mock.js (TO BE REMOVED):
1. `mockAIEnhancement()` → Replace with `/api/enhance-content`
2. `mockGeneratePortfolio()` → Replace with `/api/generate-portfolio`
3. `mockDownloadZip()` → Replace with `/api/download-portfolio/{id}`

## Frontend Integration Changes

### 1. CreatePortfolio.jsx
- Replace `mockAIEnhancement` call with axios POST to `/api/enhance-content`
- Replace `mockGeneratePortfolio` call with axios POST to `/api/generate-portfolio`
- Store returned `portfolioId` in state
- Navigate to preview with portfolioId

### 2. PreviewPortfolio.jsx
- Accept portfolioId from route params or state
- Replace `mockDownloadZip` with axios GET to `/api/download-portfolio/{portfolioId}`
- Handle ZIP file download with proper content-type

## Backend Dependencies to Install
- `google-generativeai` (Gemini AI SDK)
- `archiver` (ZIP file generation)

## Implementation Order
1. Add Gemini API key and MongoDB URL to backend/.env
2. Install required packages
3. Create portfolio model/schema
4. Implement /api/enhance-content with Gemini
5. Implement /api/generate-portfolio with MongoDB save
6. Implement /api/download-portfolio with ZIP generation
7. Update frontend to use real APIs (remove mock.js)
8. Test end-to-end flow

## Template Generation Logic

Each template (minimal-professional, creative-bold, tech-modern) will have:
- Different color schemes
- Different layouts
- Different typography styles
- Generated as single HTML file with inline CSS
