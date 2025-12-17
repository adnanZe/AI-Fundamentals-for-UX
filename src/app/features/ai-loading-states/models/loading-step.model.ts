export type StepStatus = 'pending' | 'processing' | 'completed' | 'error';

export interface LoadingStep {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
  duration: number; // milliseconds
  reasoning?: string;
  technicalDetails?: string;
}

export interface ProcessResult {
  success: boolean;
  data?: string;
  error?: string;
  totalDuration: number;
}
