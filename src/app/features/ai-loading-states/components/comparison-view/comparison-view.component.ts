import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AiProcessService } from '../../services/ai-process.service';
import { SimpleLoadingComponent } from '../simple-loading/simple-loading.component';
import { TransparentLoadingComponent } from '../transparent-loading/transparent-loading.component';

@Component({
  selector: 'app-comparison-view',
  imports: [RouterLink, SimpleLoadingComponent, TransparentLoadingComponent],
  template: `
    <div class="comparison-container">
      <!-- Back Button -->
      <a routerLink="/" class="back-button"> ← Back to Home </a>

      <!-- Comparison Grid -->
      <div class="comparison-grid">
        <!-- Simple Loading (Before) -->
        <app-simple-loading
          [isLoading]="simpleLoading()"
          [result]="simpleResult()"
          [duration]="simpleDuration()"
          (generate)="startSimpleProcess()"
        />

        <!-- Transparent Loading (After) -->
        <app-transparent-loading
          [isLoading]="aiService.processing()"
          [steps]="aiService.stepsState()"
          [progress]="aiService.progressPercentage()"
          [timeRemaining]="aiService.timeRemaining()"
          [result]="transparentResult()"
          [duration]="transparentDuration()"
          (generate)="startTransparentProcess()"
        />
      </div>

      <!-- Comparison Actions -->
      <div class="comparison-actions">
        <button
          class="action-btn primary"
          [disabled]="simpleLoading() || aiService.processing()"
          (click)="startBoth()"
        >
          🚀 Run Both Simultaneously
        </button>
        <button
          class="action-btn secondary"
          [disabled]="simpleLoading() || aiService.processing()"
          (click)="reset()"
        >
          🔄 Reset Demo
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .comparison-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 24px;
      }

      .back-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: rgba(255, 255, 255, 0.9);
        color: #667eea;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.95rem;
        transition: all 0.2s ease;
        margin-bottom: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .back-button:hover {
        background: white;
        transform: translateX(-4px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
      }

      .comparison-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        margin-bottom: 32px;
      }

      .comparison-actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        padding: 24px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .action-btn {
        padding: 14px 32px;
        border: none;
        border-radius: 10px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .action-btn.primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .action-btn.primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .action-btn.secondary {
        background: #f3f4f6;
        color: #374151;
        border: 2px solid #e5e7eb;
      }

      .action-btn.secondary:hover:not(:disabled) {
        background: #e5e7eb;
      }

      .action-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      @media (max-width: 1024px) {
        .comparison-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ComparisonViewComponent {
  protected readonly aiService = inject(AiProcessService);

  protected readonly simpleLoading = signal(false);
  protected readonly simpleResult = signal<string | null>(null);
  protected readonly simpleDuration = signal(0);

  protected readonly transparentResult = signal<string | null>(null);
  protected readonly transparentDuration = signal(0);

  async startSimpleProcess(): Promise<void> {
    this.simpleLoading.set(true);
    this.simpleResult.set(null);

    const result = await this.aiService.simpleProcess();

    this.simpleLoading.set(false);
    this.simpleResult.set(result.data || null);
    this.simpleDuration.set(result.totalDuration);
  }

  async startTransparentProcess(): Promise<void> {
    this.transparentResult.set(null);
    this.aiService.reset();

    const result = await this.aiService.startProcess();

    this.transparentResult.set(result.data || null);
    this.transparentDuration.set(result.totalDuration);
  }

  async startBoth(): Promise<void> {
    // Reset both
    this.reset();

    // Start both processes simultaneously
    await Promise.all([this.startSimpleProcess(), this.startTransparentProcess()]);
  }

  reset(): void {
    this.simpleLoading.set(false);
    this.simpleResult.set(null);
    this.simpleDuration.set(0);

    this.transparentResult.set(null);
    this.transparentDuration.set(0);
    this.aiService.reset();
  }
}
