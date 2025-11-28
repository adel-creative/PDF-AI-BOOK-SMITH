import React, { useState, useEffect } from 'react';
import { StepInput } from './components/StepInput';
import { StepOutline } from './components/StepOutline';
import { StepGenerating } from './components/StepGenerating';
import { StepResult } from './components/StepResult';
import { WizardStep, BookData, GenerationProgress } from './types';
import { generateBookOutline, generateChapterContent, generateCoverImage } from './services/geminiService';
import { Wand2 } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<WizardStep>(WizardStep.INPUT);
  const [isLoading, setIsLoading] = useState(false);
  const [bookData, setBookData] = useState<Partial<BookData>>({});
  const [progress, setProgress] = useState<GenerationProgress>({
    currentTask: '',
    progressPercent: 0,
    completedChapters: 0,
    totalChapters: 0
  });
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg]);
  };

  // Step 1 -> 2: Generate Outline
  const handleInputSubmit = async (topic: string) => {
    setIsLoading(true);
    setBookData({ topic });
    addLog(`Analyzing topic: ${topic}...`);
    
    try {
      const outline = await generateBookOutline(topic);
      setBookData(prev => ({ ...prev, ...outline }));
      setStep(WizardStep.OUTLINE);
      addLog("Outline generated successfully.");
    } catch (error) {
      alert("Failed to generate outline. Please try again.");
      addLog("Error generating outline.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 -> 3 -> 4: Generate Content & Cover
  const handleStartGeneration = async () => {
    if (!bookData.chapters || !bookData.title || !bookData.topic) return;

    setStep(WizardStep.GENERATING);
    const totalOps = bookData.chapters.length + 1; // Chapters + Cover
    let completedOps = 0;

    const updateProgress = (task: string) => {
      setProgress({
        currentTask: task,
        progressPercent: (completedOps / totalOps) * 100,
        completedChapters: completedOps,
        totalChapters: totalOps
      });
    };

    try {
      // 1. Start Cover Image Generation (Async/Parallel if we wanted, but let's keep it simple sequential or purely async block)
      // We'll run cover generation in parallel with chapter 1 to save time
      addLog("Starting creative process...");
      updateProgress("Designing cover art...");
      
      const coverPromise = generateCoverImage(bookData.title, bookData.topic)
        .then(base64 => {
          if (base64) addLog("Cover art generated.");
          else addLog("Cover art skipped (unavailable).");
          return base64;
        });

      // 2. Generate Chapters Sequentially
      const filledChapters = [];
      for (let i = 0; i < bookData.chapters.length; i++) {
        const chapter = bookData.chapters[i];
        updateProgress(`Writing Chapter ${i + 1}: ${chapter.title}`);
        addLog(`Writing "${chapter.title}"...`);

        const content = await generateChapterContent(
          bookData.title, 
          chapter, 
          bookData.targetAudience || "General Audience"
        );
        
        filledChapters.push({ ...chapter, content });
        completedOps++;
        addLog(`Chapter ${i + 1} completed.`);
      }

      // Wait for cover
      updateProgress("Finalizing book layout...");
      const coverImage = await coverPromise;
      completedOps++; // Cover done

      setBookData(prev => ({
        ...prev,
        chapters: filledChapters,
        coverImageBase64: coverImage
      }));
      
      updateProgress("Done!");
      setTimeout(() => setStep(WizardStep.RESULT), 1000);

    } catch (error) {
      console.error(error);
      addLog("Critical error during generation.");
      alert("Something went wrong during generation.");
      setStep(WizardStep.OUTLINE); // Go back
    }
  };

  const handleReset = () => {
    setBookData({});
    setLogs([]);
    setStep(WizardStep.INPUT);
    setProgress({ currentTask: '', progressPercent: 0, completedChapters: 0, totalChapters: 0 });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Wand2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">AI BookSmith</span>
          </div>
          
          <div className="text-xs font-medium text-slate-400 uppercase tracking-widest hidden sm:block">
             {step === WizardStep.INPUT && "Step 1: Ideation"}
             {step === WizardStep.OUTLINE && "Step 2: Structure"}
             {step === WizardStep.GENERATING && "Step 3: Production"}
             {step === WizardStep.RESULT && "Step 4: Publication"}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12">
        {step === WizardStep.INPUT && (
          <StepInput onNext={handleInputSubmit} isLoading={isLoading} />
        )}
        
        {step === WizardStep.OUTLINE && (
          <StepOutline 
            data={bookData} 
            onGenerate={handleStartGeneration} 
            onBack={handleReset} 
          />
        )}

        {step === WizardStep.GENERATING && (
          <StepGenerating progress={progress} logs={logs} />
        )}

        {step === WizardStep.RESULT && bookData.title && (
          <StepResult book={bookData as BookData} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} AI BookSmith. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
