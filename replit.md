# PesanTech Finance - Financial Management System for Islamic Boarding Schools

## Overview

PesanTech Finance is a modern, full-stack financial management application designed specifically for Islamic boarding schools (pesantren). The system provides comprehensive financial tracking, role-based access control, and transparent reporting capabilities with a futuristic dark-themed UI.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with a custom dark theme and futuristic design elements
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **Development**: tsx for TypeScript execution in development

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Provider**: Neon Database (serverless PostgreSQL)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect integration
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Role-Based Access**: Three user roles (admin, bendahara, pengurus)
- **Protected Routes**: All application routes require authentication

### Financial Management
- **Transaction Types**: Income and expense tracking
- **Categories**: Customizable transaction categories with color coding
- **Real-time Stats**: Dashboard with financial summaries and metrics
- **Date Range Filtering**: Filter transactions by date ranges

### User Interface
- **Design System**: Futuristic dark theme with neon accents
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Components**: Comprehensive UI component library based on Radix UI
- **Animations**: CSS animations for enhanced user experience

### Data Models
- **Users**: Authentication and role management
- **Categories**: Transaction categorization with type distinction
- **Transactions**: Financial record keeping with category relationships
- **Sessions**: Secure session management (required for Replit Auth)

## Data Flow

1. **Authentication Flow**:
   - User accesses application → Redirected to Replit Auth
   - Successful authentication → Session created in PostgreSQL
   - User data synced with local user table

2. **Transaction Flow**:
   - User creates transaction → Validated with Zod schemas
   - Data persisted to PostgreSQL via Drizzle ORM
   - Real-time updates through React Query cache invalidation

3. **Dashboard Flow**:
   - Page load → Multiple API calls for stats, transactions, announcements
   - Data aggregated and displayed in cards and charts
   - Auto-refresh capabilities for real-time updates

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL (Neon serverless)
- **Authentication**: Replit Auth service
- **UI Framework**: React ecosystem (React Query, Hook Form, Wouter)
- **Styling**: Tailwind CSS with PostCSS processing

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Fast development server and build tool
- **ESBuild**: Backend bundling for production
- **Drizzle Kit**: Database schema management

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit modules
- **Database**: PostgreSQL 16 module
- **Port Configuration**: Internal port 5000, external port 80
- **Hot Reload**: Vite HMR for frontend, tsx for backend

### Production Build
- **Frontend**: Vite build to `dist/public`
- **Backend**: ESBuild bundle to `dist/index.js`
- **Deployment Target**: Replit Autoscale
- **Environment**: Production environment variables

### Configuration Files
- **Vite**: Custom configuration with path aliases and plugins
- **TypeScript**: Shared config for client, server, and shared code
- **Tailwind**: Extended theme with custom color variables
- **Drizzle**: PostgreSQL connection and migration settings

## Changelog

```
Changelog:
- June 27, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```