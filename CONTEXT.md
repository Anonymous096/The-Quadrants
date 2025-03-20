# Context for Student Campus Life Improvement Platform

## Overview

The **Student Campus Life Improvement Platform** is designed to help students manage various aspects of their college life, including finance, academics, and social interactions. It integrates modern technologies such as AI-driven assistance and centralized campus services to enhance the overall student experience.

## Features

### 1. Finance Management

- **Virtual Card System**: Students receive credits that they can use for various transactions.
- **Expenditure Log**: A tool for students to track and manage their expenses effectively.

### 2. Exam Preparation Assistance

- **LLM for Notes Understanding**: AI-driven summarization and explanation of notes.
- **Search Engine for Course Videos**: Fetches relevant course-related videos.
- **Centralized Notes Provision**: A repository for structured study materials.

### 3. Interview Preparation Assistance

- **Campus Company Availability**: Information on companies visiting the campus.
- **LLM for Resume Building and Assessment**: AI-driven resume evaluation and interview preparation.

### 4. Student Portal System

- **Bus Routing**: Displays real-time bus schedules and routes.
- **Roommate Allotment & Change Requests**: Roommate preference and request system.
- **Car Pooling**: Platform for students to offer and request rides.

## Tech Stack

- **Frontend**: Next.js with TypeScript
- **Backend**: FastAPI
- **Authentication**: Clerk (Admin & Student roles)
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI GPT API
- **Hosting**: Vercel (Frontend), Supabase (DB & Auth), AWS/GCP (Backend)

## Development Roadmap

1. **Project Setup**: Initialize Next.js, FastAPI, and configure Clerk authentication.
2. **Database Setup**: Configure Supabase with PostgreSQL.
3. **Feature Development**: Implement finance tracking, AI-powered learning, and student services.
4. **Security & Testing**: Ensure authentication, role-based access, and data protection.
5. **Deployment & Scaling**: Deploy frontend to Vercel, backend to AWS/GCP, and use Supabase for database & authentication.

## Future Enhancements

- AI-based **personalized study recommendations**
- Integration with **campus ERP systems**
- **Student community forums** for peer discussions
