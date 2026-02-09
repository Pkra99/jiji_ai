# Learn with Jiji - Backend Service

> AI-driven learning companion backend powering Jiji's search & respond

## Context

Learn with Jiji is an AI-driven learning companion that personalizes how professionals, founders, young adults, and teams learn about AI. This backend service powers the search & respond flow.

**Supported Content Types:** Text, Presentations (PPT), videos

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (mocked) |
| Storage | Supabase Storage |

---

## API Flow

1. User sends a query (e.g., "Explain RAG")
2. Backend validates request
3. Backend fetches matching resources from Supabase
4. Backend responds with:
   - Answer text (mocked AI response)
   - Resource links (PPT + Video)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase account & project

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run database schema
# Copy sql/schema.sql to Supabase SQL Editor and run
```

### Environment Variables

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_jwt_anon_key
SUPABASE_SERVICE_KEY=your_jwt_service_key
PORT=3000
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm run build && npm start

# Run tests
npm test
```

---

## API Reference

### POST /ask-jiji

Main endpoint for querying Jiji.

**Request:**
```json
{
  "query": "Explain RAG",
  "userId": "optional-user-uuid"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "answer": "RAG (Retrieval-Augmented Generation) is...",
    "resources": [
      {
        "id": "uuid",
        "title": "Introduction to RAG",
        "type": "ppt",
        "url": "https://..."
      }
    ],
    "queryId": "uuid"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Query is required"
  }
}
```

### GET /health

Health check endpoint.

```json
{ "status": "ok", "timestamp": "2026-02-09T12:00:00Z" }
```

---

## Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profile data (id, email, full_name) |
| `queries` | Query history (query_text, response_text) |
| `resources` | Learning content (title, type, storage_path, tags) |

### Storage

- Bucket: `resources`
- Contains: 1 sample PPT file, 1 sample video file

---

## Security

- ✅ Row Level Security (RLS) in Supabase
- ✅ JWT-based authentication (not legacy role-based)
- ✅ No secrets in code (env vars only)
- ✅ Input validation & sanitization

---

## Project Structure

```
src/
├── index.ts              # Express server entry point
├── config/supabase.ts    # Supabase client (JWT-based)
├── routes/
│   ├── index.ts          # Route aggregator + health check
│   └── jiji.routes.ts    # POST /ask-jiji endpoint
├── services/
│   ├── resource.service.ts   # Supabase resource fetching
│   └── response.service.ts   # Mocked AI responses
├── middleware/
│   ├── validation.ts     # Request validation
│   └── errorHandler.ts   # Error handling
└── types/index.ts        # TypeScript interfaces
```

---

