// app/api/llm/route.ts
// Using App Router syntax for API routes

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Define error types
class APIError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Validate environment variables
function validateEnvironment() {
  const LLM_API_KEY = process.env.LLM_API_KEY;
  const LLM_API_URL = process.env.LLM_API_URL;

  const missingVars: string[] = [];
  if (!LLM_API_KEY) missingVars.push('LLM_API_KEY');
  if (!LLM_API_URL) missingVars.push('LLM_API_URL');

  if (missingVars.length > 0) {
    throw new APIError(
      `Missing required environment variables: ${missingVars.join(', ')}`,
      500
    );
  }

  return { LLM_API_KEY, LLM_API_URL };
}

// Validate input
function validateInput(prompt: any) {
  if (!prompt) {
    throw new APIError('Prompt is required', 400);
  }

  if (typeof prompt !== 'string') {
    throw new APIError('Prompt must be a string', 400);
  }

  if (prompt.trim().length === 0) {
    throw new APIError('Prompt cannot be empty', 400);
  }

  if (prompt.length > 10000) {
    throw new APIError('Prompt is too long (max 10000 characters)', 400);
  }

  return prompt.trim();
}

// Handle API errors
function handleAPIError(error: unknown): NextResponse {
  console.error('LLM API Error:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      { 
        error: error.message,
        details: error.details 
      },
      { status: error.statusCode }
    );
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || 'External API error';
    
    return NextResponse.json(
      { 
        error: message,
        details: {
          originalError: error.message,
          status: status
        }
      },
      { status }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'Unknown error occurred' },
    { status: 500 }
  );
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    const { LLM_API_KEY, LLM_API_URL } = validateEnvironment();

    // Parse and validate request body
    const body = await request.json();
    const prompt = validateInput(body.prompt);

    // Make API call to LLM
    const response = await axios.post(
      LLM_API_URL!,
      { prompt },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LLM_API_KEY}`,
        },
        timeout: 30000, // 30 second timeout
      }
    );

    // Return successful response
    return NextResponse.json(response.data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    return handleAPIError(error);
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}