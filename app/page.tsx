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
      const chatHistory = [
        ...conversation,
        { role: 'assistant', content: value },
      ];
      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await response.json();
      setValue('');
      setConversation([...chatHistory, { role: 'user', content: data.item }]);
    }
  };

  const handleRefresh = () => {
    inputRef.current?.focus();
    setValue('');
    setConversation([]);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center w-2/3 mx-auto mt-40 text-center min-h-screen">
        <h1 className="font-bold text-4xl">Hi, I am your AI assistant</h1>
        <div className="my-12">
          <p className="mb-6 font-bold">How can I help you?</p>
          <input
            placeholder="Type your message here"
            className="w-full max-w-md input input-bordered shadow appearance-none border border-gray-500 rounded  py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-6 py-2 my-10 px-4 rounded"
            onClick={handleRefresh}
          >
            Start New Conversation
          </button>
        </div>

        <div className="textarea max-w-4xl mx-auto space-y-12 grid grid-cols-1">
          {conversation.map((item, index) => (
            <React.Fragment key={index}>
              <br />
              {item.role === 'user' ? (
                <div className="place-self-end text-right">
                  <div className="bg-blue-100 text-blue-900 p-5 rounded-2xl rounded-tr-none border border-gray-300">
                    <strong>AI Assistant</strong>
                    <br />
                    {item.content}
                  </div>
                </div>
              ) : (
                <div className="place-self-start text-left">
                  <div className="bg-white border border-gray-300 p-5 rounded-2xl rounded-tl-none">
                    <strong>User</strong>
                    <br />
                    {item.content}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
