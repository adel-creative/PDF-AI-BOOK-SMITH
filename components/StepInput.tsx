import React, { useState } from 'react';
import { Sparkles, BookOpen } from 'lucide-react';

interface StepInputProps {
  onNext: (topic: string) => void;
  isLoading: boolean;
}

export const StepInput: React.FC<StepInputProps> = ({ onNext, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onNext(input.trim());
    }
  };

  const suggestions = [
    "A guide to urban gardening for beginners",
    "A sci-fi mystery set on Mars in 2080",
    "Healthy meal prep strategies for busy parents",
    "The history of coffee and its global impact"
  ];

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          What book do you want to write?
        </h1>
        <p className="text-lg text-slate-600">
          Describe your idea, and our AI will craft a full PDF book with chapters, content, and cover art.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. A children's story about a brave little toaster who travels to space..."
            className="w-full p-6 text-lg rounded-2xl border-2 border-slate-200 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none min-h-[160px]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="animate-pulse">Dreaming...</span>
            ) : (
              <>
                Start Drafting <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-12">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Try these ideas
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setInput(s)}
              className="text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-slate-600 text-sm"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
