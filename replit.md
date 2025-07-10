# Streakify - Productivity & Habit Tracker

## Overview

Streakify is a Progressive Web App (PWA) designed to help users stay productive through task management, daily goals, Pomodoro timer functionality, and streak tracking. The application is built with a focus on offline-first functionality and gamification elements including XP/leveling systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Context API with custom AppProvider
- **Styling**: Tailwind CSS with custom theme using aqua/teal color palette
- **Component Library**: Radix UI primitives with custom shadcn/ui components
- **Build Tool**: Vite with React plugin and runtime error overlay

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Storage Interface**: Abstracted storage layer with in-memory fallback
- **Session Management**: PostgreSQL session store (connect-pg-simple)

### PWA Features
- **Service Worker**: Custom SW for offline caching and background sync
- **Manifest**: Complete PWA manifest with icons and shortcuts
- **Offline-First**: Local storage with sync capabilities
- **Push Notifications**: Browser notification support

## Key Components

### Data Models
- **Task**: Priority-based tasks with optional quantity tracking and XP rewards
- **DailyGoal**: Recurring goals with progress tracking and daily reset
- **PomodoroSession**: Timer sessions with duration and XP tracking
- **StreakEntry**: Daily activity tracking for streak calculations
- **UserProfile**: User data with total XP, current/longest streaks
- **Settings**: App preferences including theme, Pomodoro lengths, notifications

### Core Features
1. **Task Management**: Create, edit, complete tasks with priority levels and tags
2. **Daily Goals**: Set and track daily objectives with progress rings
3. **Pomodoro Timer**: Configurable work/break intervals with session tracking
4. **Streak System**: Visual calendar showing daily activity streaks
5. **XP & Leveling**: Gamification with experience points and level progression
6. **Responsive Design**: Mobile-first with collapsible sidebar navigation

### Storage Strategy
- **Primary**: Local storage for offline-first functionality
- **Backup**: PostgreSQL database for sync and backup
- **Schema**: Shared TypeScript schemas with Zod validation
- **Migration**: Drizzle migrations for database schema changes

## Data Flow

1. **User Actions**: UI interactions trigger context methods
2. **State Updates**: Context providers manage local state updates
3. **Storage Layer**: Changes persisted to localStorage immediately
4. **Database Sync**: Background sync to PostgreSQL when online
5. **Notifications**: Toast notifications for user feedback
6. **XP Calculation**: Automatic XP rewards for completed actions

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Database ORM with PostgreSQL support
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **wouter**: Lightweight React router
- **date-fns**: Date manipulation and formatting

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Type-safe CSS variants

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production

## Deployment Strategy

### Development
- **Dev Server**: Vite development server with HMR
- **Backend**: Express server with TypeScript execution (tsx)
- **Database**: Drizzle push for schema synchronization

### Production
- **Build Process**: Vite build for frontend, esbuild for backend
- **Static Assets**: Bundled to dist/public directory
- **Server**: Node.js Express server serving static files and API
- **Database**: PostgreSQL with connection pooling

### Environment Variables
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment flag (development/production)
- **REPL_ID**: Replit-specific identifier for development tools

### PWA Deployment
- **Service Worker**: Cached static assets for offline functionality
- **Manifest**: App installation and native-like experience
- **Icons**: SVG-based icons for all platform sizes
- **Offline Support**: Core functionality available without internet

The application uses a monorepo structure with shared schemas and utilities, enabling type-safe communication between frontend and backend while maintaining clear separation of concerns.