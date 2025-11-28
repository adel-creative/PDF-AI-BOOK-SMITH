import React from 'react';
import { BookData } from '../types';
import { ArrowRight, Edit3, List } from 'lucide-react';

interface StepOutlineProps {
  data: Partial<BookData>;
  onGenerate: () => void;
  onBack: () => void;
}

export const StepOutline: React.FC<StepOutlineProps> = ({ data, onGenerate, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Book Structure</h2>
          <p className="text-slate-500">Review the outline before we write the content.</p>
        </div>
        <button
          onClick={onBack}
          className="text-slate-500 hover:text-slate-800 text-sm font-medium underline decoration-slate-300 underline-offset-4"
        >
          Start Over
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Book Title
          </label>
          <h1 className="text-3xl font-serif font-bold text-slate-900">{data.title}</h1>
          
          <div className="mt-4 flex items-start gap-2 text-sm text-slate-600 bg-blue-50 p-3 rounded-lg inline-block">
             <span className="font-semibold text-blue-700">Target Audience:</span> {data.targetAudience}
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-2 mb-6 text-indigo-600 font-semibold">
            <List className="w-5 h-5" />
            <span>Table of Contents</span>
          </div>
          
          <div className="space-y-4">
            {data.chapters?.map((chapter, index) => (
              <div key={index} className="group relative pl-8 border-l-2 border-slate-100 hover:border-indigo-200 transition-colors">
                <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-100 text-[10px] flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  {chapter.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {chapter.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onGenerate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-medium text-lg shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 flex items-center gap-2"
        >
          Looks Great, Write It! <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
