# Neuracert - LLM Security Testing Platform

## Overview

Neuracert is a comprehensive security testing platform for Large Language Models (LLMs). It provides tools to evaluate AI model safety through sophisticated prompts, real-time scoring, and community-driven security assessments. The platform supports multiple AI providers and includes features for individual testing, battle comparisons, and leaderboard tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite for fast development and optimized builds
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessibility and consistency
- **Styling**: Tailwind CSS with custom design tokens for a security-focused dark theme with cyber-aesthetic colors
- **State Management**: TanStack React Query for server state management and data fetching
- **Routing**: React Router for client-side navigation with dedicated pages for testing, battles, leaderboard, and privacy

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Development**: Hot module replacement (HMR) through Vite integration in development mode
- **API Structure**: RESTful API endpoints prefixed with `/api` for clear separation of concerns

### Data Storage Solutions
- **Primary Database**: PostgreSQL configured through Drizzle ORM with Neon serverless database provider
- **Schema Management**: Drizzle Kit for database migrations and schema definitions
- **Local Storage**: Browser localStorage for API key persistence and user preferences
- **In-Memory Storage**: Fallback MemStorage implementation for development without database

### Authentication and Authorization
- **API Key Management**: Client-side storage of third-party AI provider API keys with masking for security
- **No User Authentication**: Platform operates without traditional user accounts, focusing on anonymous testing
- **Privacy-First**: No collection of personal data or test content, only anonymized scoring metrics

### External Dependencies
- **AI Providers**: 
  - OpenAI GPT models via official API
  - Google Gemini through Generative Language API
  - OpenRouter for access to various open-source models
- **Database**: Neon PostgreSQL serverless database with connection pooling
- **UI Framework**: Extensive Radix UI component ecosystem for accessible interface elements
- **Development Tools**: 
  - Replit integration for development environment
  - ESBuild for production bundling
  - PostCSS with Autoprefixer for CSS processing

The architecture emphasizes security testing capabilities while maintaining user privacy through client-side API key storage and minimal data collection. The system is designed to scale horizontally through serverless database connections and can easily integrate additional AI providers through the modular API structure.