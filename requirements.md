# Plant Recognizer - MVP Requirements

## Overview
A monorepo web app that allows users to upload photos of plants and identify them using the Pl@ntNet API.

## MVP Scope
- **No authentication required** - anonymous usage
- Users can upload plant photos and get identification results
- Users can view history of past identifications
- All identifications are logged and visible to users

## Core Functionalities

### 1. Photo Upload
- Accept standard image formats: JPEG, PNG, HEIC/HEIF (iOS), WebP
- Support uploads from all platforms: Mac, iPhone, Windows, Android
- Image constraints:
  - Max file size: 10MB
  - Recommended resolution: handled automatically by browser
  - Support both camera capture and file selection

### 2. Plant Identification
- Integrate with Pl@ntNet API for plant detection
- Display results including:
  - Plant species name (common and scientific)
  - Confidence score/match percentage
  - Multiple matches if available (top 3-5 results)
  - Plant image from API (if available)

### 3. Results Display
- Show identification results in an intuitive format
- Display uploaded photo alongside results
- Handle multiple possible matches with confidence scores

### 4. History View
- Display list of all past identifications
- Show thumbnail of uploaded photo
- Show identified plant name
- Include timestamp of identification
- Allow users to view full details of past identifications

### 5. Data Persistence
- Log all identification attempts in database with:
  - Uploaded photo reference
  - API response data
  - Timestamp
  - Results (species, confidence, etc.)
- Store uploaded photos in file storage

### 6. Error Handling
- Handle upload failures (file too large, unsupported format)
- Handle API errors (service down, rate limits)
- Handle "no match found" scenario - show friendly message
- Handle network timeouts

## Tech Stack

### Frontend
- **Next.js** (App Router)
- **Tailwind CSS** for styling
- TypeScript

### Backend & Infrastructure
- **Convex** for:
  - Database (storing identification history)
  - File storage (uploaded plant photos)
  - Serverless functions (API integration logic)
  - Real-time updates (if needed for history)

### External API
- **Pl@ntNet API** for plant identification

## Monorepo Structure

This project uses a **pnpm workspace** monorepo structure with the following organization:

### Directory Layout
```
plant-recognizer/
├── apps/
│   └── web/                           # Next.js + Convex application
│       ├── app/                       # Next.js App Router pages
│       ├── components/                # React components
│       ├── convex/                    # Convex backend functions & schema
│       ├── lib/                       # Frontend utilities
│       └── public/                    # Static assets
├── packages/
│   ├── types/                         # Shared TypeScript types
│   └── config/                        # Shared configuration (ESLint, TS, Tailwind)
└── package.json                       # Root workspace configuration
```

### Package Responsibilities

**`apps/web`** - Main Application
- Next.js frontend with App Router
- Convex backend (serverless functions, database schema)
- File storage integration for uploaded plant photos
- Pl@ntNet API integration via Convex HTTP actions

**`packages/types`** - Shared Types
- Plant identification types
- Pl@ntNet API response types
- Database schema types
- Shared across frontend and backend for type safety

**`packages/config`** - Shared Configuration
- ESLint configuration
- TypeScript base configuration
- Tailwind CSS base configuration

### Key Features per Area

**Frontend (`apps/web/app/`)**
- `/` - Photo upload interface with camera/file selection
- `/history` - List view of all past identifications
- `/results/[id]` - Detailed view of individual identification

**Backend (`apps/web/convex/`)**
- `schema.ts` - Database schema for identifications and metadata
- `identifications.ts` - CRUD operations for identification records
- `http.ts` - HTTP actions for Pl@ntNet API integration
- File storage for uploaded plant images

**Shared (`packages/types/`)**
- Cross-package type definitions
- Ensures type safety between frontend and backend
- Single source of truth for data structures

### Benefits of This Structure
- **Type Safety**: End-to-end TypeScript types shared between packages
- **Code Reusability**: Shared configuration and utilities
- **Scalability**: Easy to add new apps (mobile, admin) or packages
- **Developer Experience**: Clear separation of concerns
- **Maintainability**: Changes to types propagate automatically

## Future Considerations (Post-MVP)
- User authentication and personal history
- Plant care information
- Favorites/bookmarking
- Social sharing
- Plant disease detection