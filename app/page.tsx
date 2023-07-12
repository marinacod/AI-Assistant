//import Image from 'next/image';
'use client'; // This is a client component
import React, { useRef } from 'react';

interface Conversation {
  role: string;
  content: string;
}

export default function Home() {
  const [value, setValue] = React.useState<string>('');
  const [conversation, setConversation] = React.useState<Conversation[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    []
  );

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const chatHistory = [...conversation, { role: 'assistant', content: value }];
      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: value }),
      });

      const data = await response.json();
      setValue('');
      setConversation([
        ...chatHistory,
        { role: "user", content: data.item },
      ]);
    }
  };

  const handleRefresh = () => {
    inputRef.current?.focus();
    setValue('');
    setConversation([]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello</h1>
      <div className="my-12">
        <p className="mb-6 font-bold">Please type your prompt</p>
        <input
          placeholder="Type here"
          className="w-full max-w-xs input input-bordered input-secondary dark:bg-slate-800"
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-10 px-4 rounded"
          onClick={handleRefresh}
        >
          Start New Conversation
        </button>
      </div>
      <div className="textarea">
        {conversation.map((item, index) => (
          <React.Fragment key={index}>
            <br />
            {item.role === 'user' ? (
              <div>
                <div>
                  <strong>AI Assistant</strong>
                  <br />
                  {item.content}
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <strong>User</strong>
                  <br />
                  {item.content}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </main>
  );
}
