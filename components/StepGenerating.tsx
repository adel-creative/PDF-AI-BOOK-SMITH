import React from 'react';
import { GenerationProgress } from '../types';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

interface StepGeneratingProps {
  progress: GenerationProgress;
  logs: string[];
}

export const StepGenerating: React.FC<StepGeneratingProps> = ({ progress, logs }) => {
  return (
    <div className="max-w-2xl mx-auto w-full text-center">
      <div className="mb-12">
        <div className="relative w-32 h-32 mx-auto mb-6">
           <svg className="w-full h-full transform -rotate-90">
             <circle
               cx="64"
               cy="64"
               r="60"
               stroke="currentColor"
               strokeWidth="8"
               fill="transparent"
               className="text-slate-100"
             />
             <circle
               cx="64"
               cy="64"
               r="60"
               stroke="currentColor"
               strokeWidth="8"
               fill="transparent"
               strokeDasharray={377}
               strokeDashoffset={377 - (377 * progress.progressPercent) / 100}
               className="text-indigo-600 transition-all duration-500 ease-out"
             />
           </svg>
           <div className="absolute inset-0 flex items-center justify-center flex-col">
             <span className="text-3xl font-bold text-slate-800">{Math.round(progress.progressPercent)}%</span>
           </div>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2 animate-pulse">
          {progress.currentTask}
        </h2>
        <p className="text-slate-500">
          AI is writing your book. This may take a minute.
        </p>
      </div>

      <div className="bg-slate-900 rounded-xl p-6 text-left font-mono text-sm max-h-64 overflow-y-auto shadow-inner">
        <div className="space-y-2">
            {logs.length === 0 && <span className="text-slate-500">Initializing...</span>}
            {logs.slice().reverse().map((log, i) => (
                <div key={i} className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                    {log.includes("Done") || log.includes("Generated") ? (
                         <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    ) : (
                         <Loader2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0 animate-spin" />
                    )}
                    <span className={log.includes("Error") ? "text-red-400" : "text-slate-300"}>
                        {log}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
