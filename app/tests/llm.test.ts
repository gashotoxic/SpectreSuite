import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST, GET } from '../../app/api/llm/route';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(require('axios').default);

// Mock NextRequest
function createMockNextRequest(method: string, body?: any, headers?: Record<string, string>) {
  const mockRequest = {
    method: method.toUpperCase(),
    json: async () => body,
    headers: {
      get: (name: string) => headers?.[name] || null,
    },
  } as any;
  
  return mockRequest;
}

describe('LLM API Route', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Set up environment variables
    process.env.LLM_API_KEY = 'test-api-key';
    process.env.LLM_API_URL = 'https://api.example.com/llm';
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.LLM_API_KEY;
    delete process.env.LLM_API_URL;
  });

  it('should return a 405 status for GET requests', async () => {
    const request = createMockNextRequest('GET');
    const response = await GET(request);
    expect(response.status).toBe(405);
    const data = await response.json();
    expect(data.error).toBe('Method not allowed');
  });

  it('should return a 400 status if prompt is not provided', async () => {
    const request = createMockNextRequest('POST', {});
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Prompt is required');
  });

  it('should return a 400 status if prompt is not a string', async () => {
    const request = createMockNextRequest('POST', { prompt: 123 });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Prompt must be a string');
  });

  it('should return a 400 status if prompt is empty', async () => {
    const request = createMockNextRequest('POST', { prompt: '   ' });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Prompt cannot be empty');
  });

  it('should return a 400 status if prompt is too long', async () => {
    const longPrompt = 'a'.repeat(10001);
    const request = createMockNextRequest('POST', { prompt: longPrompt });
    const response = await POST(request);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Prompt is too long (max 10000 characters)');
  });

  it('should return a 500 status if environment variables are missing', async () => {
    // Remove environment variables
    delete process.env.LLM_API_KEY;
    delete process.env.LLM_API_URL;

    const request = createMockNextRequest('POST', { prompt: 'Test Prompt' });
    const response = await POST(request);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toContain('Missing required environment variables');
  });

  it('should return a 200 status with the LLM response', async () => {
    const mockResponse = { data: 'LLM Response' };
    mockedAxios.post.mockResolvedValue(mockResponse);

    const request = createMockNextRequest('POST', { prompt: 'Test Prompt' });
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toBe('LLM Response');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.example.com/llm',
      { prompt: 'Test Prompt' },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-api-key',
        },
        timeout: 30000,
      }
    );
  });

  it('should return a 500 status if there is an error calling the LLM API', async () => {
    const mockError = new Error('API Error');
    mockedAxios.post.mockRejectedValue(mockError);

    const request = createMockNextRequest('POST', { prompt: 'Test Prompt' });
    const response = await POST(request);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Internal server error');
    if (process.env.NODE_ENV === 'development') {
      expect(data.details).toBe('API Error');
    }
  });

  it('should handle axios error responses', async () => {
    const mockError = {
      response: {
        status: 401,
        data: { error: 'Unauthorized' },
      },
    };
    mockedAxios.post.mockRejectedValue(mockError);

    const request = createMockNextRequest('POST', { prompt: 'Test Prompt' });
    const response = await POST(request);
    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('should handle successful prompt processing', async () => {
    const mockResponse = { 
      data: { 
        response: 'This is a test response from the LLM',
        usage: { tokens: 50 }
      } 
    };
    mockedAxios.post.mockResolvedValue(mockResponse);

    const request = createMockNextRequest('POST', { prompt: 'Hello, how are you?' });
    const response = await POST(request);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.response).toBe('This is a test response from the LLM');
    expect(data.usage.tokens).toBe(50);
  });
});