// PromptTester.tsx
import { useState } from 'react';
import { leetspeak } from '../../lib/evasions/leetspeak';
import { narrativeInjection } from '../../lib/evasions/narrativeInjection';

const PromptTester = () => {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Apply evasion functions to the input text
      const leetText = leetspeak(inputText);
      const narrativeText = narrativeInjection(leetText, 'Once upon a time, in a world of code,');

      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: narrativeText }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setResponse(data);
    } catch (error) {
      console.error('Error calling LLM API:', error);
      setResponse('Error calling LLM API');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} />
        <button type="submit">Send</button>
      </form>
      <div>{response}</div>
    </div>
  );
};

export default PromptTester;