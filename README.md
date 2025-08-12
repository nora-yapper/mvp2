# Startup MVP Platform

A comprehensive platform for startup development and management built with Next.js 15, React 19, and modern web technologies.

## Features

- **Research Planning**: Analyze problems, plan customer interviews, and evaluate questions
- **Product Development**: Create product roadmaps and manage development tasks
- **Sales & Marketing**: Develop sales strategies and manage outreach campaigns
- **Team Management**: Organize team members and track progress
- **AI-Powered Insights**: Get intelligent recommendations and analysis

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **AI Integration**: OpenAI API with AI SDK
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install` or `pnpm install`
3. Set up environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
4. Run the development server: `npm run dev` or `pnpm dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`
OPENAI_API_KEY=your_openai_api_key_here
\`\`\`

## Project Structure

- `/app` - Next.js App Router pages and API routes
- `/components` - Reusable UI components
- `/lib` - Utility functions and configurations
- `/public` - Static assets

## Deployment

This project is optimized for deployment on Vercel. Simply connect your repository to Vercel and add the required environment variables.

## License

MIT License
