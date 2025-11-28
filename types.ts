export interface Chapter {
  title: string;
  description: string;
  content?: string;
  isGenerating?: boolean;
  isDone?: boolean;
}

export interface BookData {
  title: string;
  topic: string;
  targetAudience: string;
  chapters: Chapter[];
  coverImageBase64?: string;
}

export enum WizardStep {
  INPUT = 'INPUT',
  OUTLINE = 'OUTLINE',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
}

export interface GenerationProgress {
  currentTask: string;
  progressPercent: number;
  completedChapters: number;
  totalChapters: number;
}
