import { Injectable, signal } from '@angular/core';
import { LoadingStep, ProcessResult, StepStatus } from '../models/loading-step.model';

@Injectable({
  providedIn: 'root',
})
export class AiProcessService {
  private readonly steps = signal<LoadingStep[]>([]);
  private readonly isProcessing = signal(false);
  private readonly progress = signal(0);
  private readonly currentStepIndex = signal(-1);
  private readonly estimatedTimeRemaining = signal(0);

  readonly stepsState = this.steps.asReadonly();
  readonly processing = this.isProcessing.asReadonly();
  readonly progressPercentage = this.progress.asReadonly();
  readonly currentStep = this.currentStepIndex.asReadonly();
  readonly timeRemaining = this.estimatedTimeRemaining.asReadonly();

  private readonly defaultSteps: Omit<LoadingStep, 'status'>[] = [
    {
      id: 1,
      title: 'Analyzing your request',
      description: 'Understanding context and requirements',
      duration: 3000,
      reasoning:
        'Breaking down the user input to identify key requirements, tone, and expected output format.',
      technicalDetails: 'NLP tokenization → Intent classification → Context extraction',
    },
    {
      id: 2,
      title: 'Processing with AI model',
      description: 'Running GPT-4 inference on structured prompt',
      duration: 4000,
      reasoning:
        'Executing the large language model with optimized parameters for your specific request.',
      technicalDetails: 'Model: GPT-4 → Temperature: 0.7 → Max tokens: 2048',
    },
    {
      id: 3,
      title: 'Gathering relevant data',
      description: 'Searching knowledge base for supporting information',
      duration: 5000,
      reasoning:
        'Querying internal databases and verified sources to ensure accurate and contextual information.',
      technicalDetails: 'Vector search → Semantic matching → Relevance scoring (top 10 results)',
    },
    {
      id: 4,
      title: 'Generating content',
      description: 'Creating structured response with citations',
      duration: 7000,
      reasoning:
        'Synthesizing information into coherent content while maintaining factual accuracy and proper attribution.',
      technicalDetails: 'Content assembly → Citation linking → Style formatting',
    },
    {
      id: 5,
      title: 'Finalizing output',
      description: 'Formatting and quality checking',
      duration: 8000,
      reasoning:
        'Running final checks for grammar, coherence, and ensuring the output meets quality standards.',
      technicalDetails: 'Grammar check → Readability score → Bias detection → Output sanitization',
    },
  ];

  /**
   * Starts the AI process simulation with step-by-step updates
   */
  async startProcess(): Promise<ProcessResult> {
    this.isProcessing.set(true);
    this.progress.set(0);
    this.currentStepIndex.set(-1);

    // Initialize steps
    const initialSteps: LoadingStep[] = this.defaultSteps.map((step) => ({
      ...step,
      status: 'pending' as StepStatus,
    }));
    this.steps.set(initialSteps);

    const totalDuration = this.defaultSteps.reduce((sum, step) => sum + step.duration, 0);
    this.estimatedTimeRemaining.set(totalDuration);

    const startTime = Date.now();

    try {
      // Process each step sequentially
      for (let i = 0; i < initialSteps.length; i++) {
        this.currentStepIndex.set(i);

        // Update step status to processing
        this.updateStepStatus(i, 'processing');

        // Simulate processing time
        await this.delay(initialSteps[i].duration);

        // Mark step as completed
        this.updateStepStatus(i, 'completed');

        // Update progress
        const completedSteps = i + 1;
        const progressPercent = Math.round((completedSteps / initialSteps.length) * 100);
        this.progress.set(progressPercent);

        // Update time remaining
        const elapsed = Date.now() - startTime;
        const remaining = totalDuration - elapsed;
        this.estimatedTimeRemaining.set(Math.max(0, remaining));
      }

      const totalTime = Date.now() - startTime;
      this.isProcessing.set(false);

      return {
        success: true,
        data: 'Content generated successfully! Here is your AI-generated article with proper structure and citations.',
        totalDuration: totalTime,
      };
    } catch (error) {
      this.isProcessing.set(false);
      return {
        success: false,
        error: 'Failed to process your request. Please try again.',
        totalDuration: Date.now() - startTime,
      };
    }
  }

  /**
   * Simulates a simple loading without detailed steps
   */
  async simpleProcess(): Promise<ProcessResult> {
    const totalDuration = this.defaultSteps.reduce((sum, step) => sum + step.duration, 0);
    await this.delay(totalDuration);

    return {
      success: true,
      data: 'Content generated successfully!',
      totalDuration,
    };
  }

  /**
   * Resets the process state
   */
  reset(): void {
    this.steps.set([]);
    this.isProcessing.set(false);
    this.progress.set(0);
    this.currentStepIndex.set(-1);
    this.estimatedTimeRemaining.set(0);
  }

  private updateStepStatus(index: number, status: StepStatus): void {
    this.steps.update((steps) =>
      steps.map((step, i) => (i === index ? { ...step, status } : step))
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
