import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PromptTester from '../components/PromptTester';

describe('PromptTester Component', () => {
  it('renders the input textarea and submit button', () => {
    render(<PromptTester />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('submits the form with the correct prompt', async () => {
    const mockResponse = new Response(JSON.stringify('LLM Response'), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    render(<PromptTester />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test Prompt' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: 'Test Prompt' }),
      });
    });

    fetchMock.mockRestore();
  });

  it('displays the response from the API on successful call', async () => {
    const mockResponse = new Response(JSON.stringify('LLM Response'), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    render(<PromptTester />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test Prompt' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('LLM Response')).toBeInTheDocument();
    });

    fetchMock.mockRestore();
  });

  it('displays an error message on failed API call', async () => {
    const mockResponse = new Response(null, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(mockResponse);

    render(<PromptTester />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test Prompt' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Error calling LLM API')).toBeInTheDocument();
    });

    fetchMock.mockRestore();
  });
});