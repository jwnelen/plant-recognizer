# Plant Recognizer

A web application that allows users to upload photos of plants and identify them using the Pl@ntNet API.

## Project Structure

This is a pnpm monorepo with the following structure:

- `apps/web` - Next.js frontend and Convex backend
- `packages/types` - Shared TypeScript type definitions
- `packages/config` - Shared configuration (ESLint, TypeScript, Tailwind)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example apps/web/.env.local
# Add your Convex deployment URL and Pl@ntNet API key
```

### Development

```bash
# Run the web app in development mode
pnpm web

# Or run all packages with Turbo
pnpm dev
```

### Build

```bash
# Build all packages
pnpm build
```

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: Convex (serverless functions, database, file storage)
- **External API**: Pl@ntNet for plant identification
- **Monorepo**: pnpm workspaces + Turborepo

## Features

- Upload plant photos (JPEG, PNG, HEIC, WebP)
- AI-powered plant identification via Pl@ntNet
- View identification history
- Detailed results with confidence scores
- Mobile-friendly responsive design

## Documentation

See [requirements.md](./requirements.md) for detailed project requirements and specifications.
