# Project Kisan - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
Project Kisan is an AI-powered personal assistant for farmers built with Next.js, TypeScript, and Google AI technologies. It serves as a personal agronomist, market analyst, and government scheme navigator for small-scale farmers.

## Core Features
1. **Crop Disease Diagnosis**: Multimodal Gemini model for instant image-based plant disease identification
2. **Real-Time Market Analysis**: Vertex AI-powered market price analysis and trends
3. **Government Scheme Navigator**: AI-powered guidance on agricultural subsidies and schemes
4. **Voice-First Interface**: Speech-to-Text and Text-to-Speech in local languages (Kannada, etc.)

## Technology Stack
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **AI Services**: Google Vertex AI, Gemini Pro, Gemini Vision
- **Cloud Platform**: Firebase (Auth, Firestore, Functions, Hosting)
- **Speech Services**: Google Speech-to-Text, Text-to-Speech APIs
- **Mobile-First**: Responsive design optimized for smartphones

## Code Guidelines
- Use TypeScript with strict type checking
- Follow Next.js 14 App Router patterns
- Implement proper error handling for AI API calls
- Use Firebase SDK v9+ modular approach
- Ensure mobile-first responsive design
- Implement proper loading states for AI operations
- Use proper environment variable management
- Follow accessibility best practices for voice interface

## API Integration Patterns
- Implement proper retry logic for Google AI APIs
- Use streaming responses where applicable
- Handle rate limiting gracefully
- Implement proper caching strategies
- Use proper error boundaries for AI failures

## Localization Requirements
- Support for Kannada and English languages
- Voice interface must work with local dialects
- UI text should be easily translatable
- Use proper Unicode handling for Indic languages
