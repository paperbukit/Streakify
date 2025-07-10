# Streakify - Netlify Deployment

This project is now configured for deployment on Netlify.

## Development

### Local Development (Client Only)
```bash
npm run dev
```
This runs the Vite development server with the React client.

### Local Development with Netlify Functions
```bash
npm run dev:netlify
```
This runs the full Netlify development environment including serverless functions.

### Legacy Server Development
```bash
npm run dev:server
```
This runs the original Express server for comparison.

## Deployment

### Automatic Deployment
1. Connect your GitHub repository to Netlify
2. Netlify will automatically detect the `netlify.toml` configuration
3. Build command: `npm run build`
4. Publish directory: `dist/public`

### Manual Deployment
```bash
npm run build
netlify deploy --prod --dir=dist/public
```

## Features

- **Static React App**: Optimized for Netlify's CDN
- **Serverless Functions**: API endpoints converted to Netlify Functions
- **Storage**: Hybrid storage using API when available, localStorage as fallback
- **SPA Routing**: Configured redirects for single-page application routing

## Architecture Changes

The app has been converted from a full-stack Express application to a JAMstack architecture:

- **Frontend**: Static React app built with Vite
- **Backend**: Serverless functions in `netlify/functions/`
- **Storage**: API-based storage with localStorage fallback
- **Routing**: Client-side routing with Netlify redirects

## Storage

- In production: Uses Netlify Functions for persistence
- In development: Falls back to localStorage
- Data is always backed up to localStorage for reliability

## Configuration Files

- `netlify.toml`: Netlify deployment configuration
- `netlify/functions/api.ts`: Main serverless function
- Updated `vite.config.ts`: Proxy configuration for development
- Updated `package.json`: New build and dev scripts
