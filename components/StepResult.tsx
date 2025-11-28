import React from 'react';
import { BookData } from '../types';
import { Download, Book, RefreshCw } from 'lucide-react';
import { createBookPDF } from '../services/pdfService';

interface StepResultProps {
  book: BookData;
  onReset: () => void;
}

export const StepResult: React.FC<StepResultProps> = ({ book, onReset }) => {
  
  const handleDownload = () => {
    createBookPDF(book);
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Book Preview Visual */}
        <div className="relative group perspective-1000">
           <div className="relative w-[300px] h-[460px] mx-auto bg-white rounded-r-lg shadow-2xl transform transition-transform duration-500 hover:rotate-y-6 rotate-y-3 flex flex-col overflow-hidden border-l-8 border-slate-800">
              {/* Cover Image or Fallback */}
              {book.coverImageBase64 ? (
                  <img 
                    src={`data:image/png;base64,${book.coverImageBase64}`} 
                    alt="Book Cover" 
                    className="w-full h-full object-cover"
                  />
              ) : (
                  <div className="w-full h-full bg-slate-800 p-8 flex flex-col justify-center items-center text-center">
                      <div className="w-20 h-20 border-4 border-white/20 rounded-full flex items-center justify-center mb-6">
                        <Book className="w-10 h-10 text-white/50" />
                      </div>
                      <h1 className="text-white font-serif font-bold text-2xl mb-4 leading-tight">{book.title}</h1>
                      <p className="text-slate-400 text-sm">A book about {book.topic}</p>
                  </div>
              )}
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none"></div>
           </div>
           
           {/* Shadow */}
           <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[280px] h-[20px] bg-black/20 blur-xl rounded-[100%]"></div>
        </div>

        {/* Success Content */}
        <div className="text-center lg:text-left space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
               <span className="w-2 h-2 rounded-full bg-green-500"></span> Generation Complete
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Your book is ready!</h1>
            <p className="text-lg text-slate-600">
              "{book.title}" has been fully generated with {book.chapters.length} chapters and custom cover art.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-left">
            <h3 className="font-semibold text-slate-900 mb-2">Book Summary</h3>
            <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex justify-between">
                    <span>Topic</span>
                    <span className="font-medium text-slate-800">{book.topic}</span>
                </li>
                 <li className="flex justify-between">
                    <span>Audience</span>
                    <span className="font-medium text-slate-800 truncate max-w-[200px]">{book.targetAudience}</span>
                </li>
                <li className="flex justify-between">
                    <span>Chapters</span>
                    <span className="font-medium text-slate-800">{book.chapters.length}</span>
                </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={handleDownload}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <Download className="w-5 h-5" /> Download PDF
            </button>
            <button
              onClick={onReset}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <RefreshCw className="w-5 h-5" /> Create Another
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
