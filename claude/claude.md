# Plant Recognizer - Development Commands

## Initial Setup

```bash
# Install all dependencies
pnpm install

# Copy environment variables template
cp .env.example apps/web/.env.local

# Initialize Convex (first time only)
cd apps/web
npx convex dev
```

## Development

```bash
# Run the web app in development mode
pnpm web

# Run all packages with Turbo (if multiple apps)
pnpm dev

# Run Convex dev server (in separate terminal)
cd apps/web
npx convex dev
```

## Building

```bash
# Build all packages
pnpm build

# Build specific workspace
pnpm --filter web build

# Clean all build artifacts
pnpm clean
```

## Linting & Type Checking

```bash
# Lint all packages
pnpm lint

# Lint specific workspace
pnpm --filter web lint

# Type check the types package
pnpm --filter @plant-recognizer/types lint
```

## Convex Commands

```bash
# Deploy Convex functions
cd apps/web
npx convex deploy

# View Convex dashboard
npx convex dashboard

# Run Convex functions locally
npx convex dev

# Reset Convex database (development only)
npx convex data clear
```

## Package Management

```bash
# Add dependency to web app
pnpm --filter web add <package-name>

# Add dev dependency to web app
pnpm --filter web add -D <package-name>

# Add dependency to types package
pnpm --filter @plant-recognizer/types add <package-name>

# Add dependency to root (workspace tools)
pnpm add -w <package-name>

# Update all dependencies
pnpm update -r
```

## Workspace Commands

```bash
# List all workspaces
pnpm ls -r --depth -1

# Run command in all workspaces
pnpm -r <command>

# Run command in specific workspace
pnpm --filter <workspace-name> <command>
```

## Useful Development Workflows

```bash
# Clean install (fresh start)
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install

# Check for outdated dependencies
pnpm outdated -r

# Generate Convex types (auto-generated on dev/deploy)
cd apps/web
npx convex codegen
```

## Environment Variables

Required in `apps/web/.env.local`:

```env
CONVEX_DEPLOYMENT=your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
PLANTNET_API_KEY=your-plantnet-api-key
```

## Git Workflow

```bash
# Stage all changes
git add .

# Commit with message
git commit -m "feat: add new feature"

# Push to remote
git push

# Create new branch
git checkout -b feature/new-feature
```

## Troubleshooting

```bash
# Clear Next.js cache
rm -rf apps/web/.next

# Clear Turbo cache
rm -rf .turbo

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check TypeScript errors
pnpm --filter web tsc --noEmit
```
