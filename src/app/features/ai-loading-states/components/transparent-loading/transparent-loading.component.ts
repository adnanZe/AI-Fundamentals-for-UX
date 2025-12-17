import { Component, input, output, signal } from '@angular/core';
import { LoadingStep } from '../../models/loading-step.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-transparent-loading',
  imports: [NgClass],
  template: `
    <div class="transparent-loading-container">
      <div class="content-box">
        <h3 class="title">✅ Transparent Loading</h3>
        <p class="subtitle">Step-by-step process visibility</p>

        <div class="action-area">
          @if (!isLoading()) {
          <button class="generate-btn" (click)="onGenerate()">Generate Content</button>
          } @else {
          <div class="loading-state">
            <!-- Progress Bar -->
            <div class="progress-section">
              <div class="progress-header">
                <span class="progress-label">Progress</span>
                <span class="progress-percent">{{ progress() }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="progress()"></div>
              </div>
              <div class="time-remaining">⏱️ Estimated time: {{ formatTime(timeRemaining()) }}</div>
            </div>

            <!-- Steps Timeline -->
            <div class="steps-timeline">
              @for (step of steps(); track step.id) {
              <div class="step-item" [ngClass]="getStepClass(step)">
                <div class="step-indicator">
                  @if (step.status === 'completed') {
                  <div class="step-icon completed">✓</div>
                  } @else if (step.status === 'processing') {
                  <div class="step-icon processing">
                    <div class="spinner-small"></div>
                  </div>
                  } @else {
                  <div class="step-icon pending">{{ step.id }}</div>
                  }
                </div>

                <div class="step-content">
                  <div class="step-header">
                    <h4 class="step-title">{{ step.title }}</h4>
                    @if (step.status === 'processing') {
                    <span class="step-badge processing">In Progress</span>
                    } @else if (step.status === 'completed') {
                    <span class="step-badge completed">Done</span>
                    }
                  </div>
                  <p class="step-description">{{ step.description }}</p>

                  @if (step.status === 'processing' && showDetails()) {
                  <div class="step-details">
                    <div class="reasoning-box">
                      <strong>🧠 Why this step:</strong>
                      <p>{{ step.reasoning }}</p>
                    </div>
                    <div class="technical-box">
                      <strong>⚙️ Technical:</strong>
                      <p>{{ step.technicalDetails }}</p>
                    </div>
                  </div>
                  }
                </div>
              </div>
              }
            </div>

            <!-- Toggle Details -->
            <button class="toggle-details" (click)="toggleDetails()">
              {{ showDetails() ? '👁️ Hide Details' : '🔍 Show Technical Details' }}
            </button>
          </div>
          }
        </div>

        @if (result()) {
        <div class="result-box">
          <div class="result-icon">✅</div>
          <p class="result-text">{{ result() }}</p>
          <p class="result-time">Completed in {{ duration() }}ms</p>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .transparent-loading-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .content-box {
        background: white;
        border-radius: 12px;
        padding: 32px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 8px;
      }

      .subtitle {
        font-size: 0.95rem;
        color: #6b7280;
        margin-bottom: 32px;
      }

      .action-area {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 300px;
      }

      .generate-btn {
        padding: 16px 32px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .generate-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .loading-state {
        width: 100%;
        max-width: 600px;
      }

      .progress-section {
        margin-bottom: 32px;
      }

      .progress-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .progress-label {
        font-weight: 600;
        color: #374151;
      }

      .progress-percent {
        font-weight: 700;
        color: #667eea;
        font-size: 1.1rem;
      }

      .progress-bar {
        height: 12px;
        background: #e5e7eb;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 8px;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        border-radius: 10px;
        transition: width 0.3s ease;
      }

      .time-remaining {
        font-size: 0.875rem;
        color: #6b7280;
        text-align: right;
      }

      .steps-timeline {
        margin-bottom: 24px;
        max-height: 400px;
        overflow-y: auto;
      }

      .step-item {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
        position: relative;
      }

      .step-item:not(:last-child)::before {
        content: '';
        position: absolute;
        left: 19px;
        top: 40px;
        width: 2px;
        height: calc(100% - 20px);
        background: #e5e7eb;
      }

      .step-item.processing::before {
        background: linear-gradient(180deg, #667eea 0%, #e5e7eb 100%);
      }

      .step-item.completed::before {
        background: #10b981;
      }

      .step-indicator {
        flex-shrink: 0;
      }

      .step-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 1.1rem;
      }

      .step-icon.pending {
        background: #f3f4f6;
        color: #9ca3af;
        border: 2px solid #e5e7eb;
      }

      .step-icon.processing {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        animation: pulse 2s ease-in-out infinite;
      }

      .step-icon.completed {
        background: #10b981;
        color: white;
      }

      @keyframes pulse {
        0%,
        100% {
          box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
        }
        50% {
          box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
        }
      }

      .spinner-small {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .step-content {
        flex: 1;
      }

      .step-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 4px;
      }

      .step-title {
        font-size: 1.05rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
      }

      .step-badge {
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .step-badge.processing {
        background: #dbeafe;
        color: #1e40af;
      }

      .step-badge.completed {
        background: #d1fae5;
        color: #065f46;
      }

      .step-description {
        font-size: 0.9rem;
        color: #6b7280;
        margin: 0 0 12px 0;
      }

      .step-details {
        margin-top: 12px;
        padding: 16px;
        background: #f9fafb;
        border-radius: 8px;
        animation: slideDown 0.3s ease-out;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .reasoning-box,
      .technical-box {
        margin-bottom: 12px;
      }

      .reasoning-box:last-child,
      .technical-box:last-child {
        margin-bottom: 0;
      }

      .reasoning-box strong,
      .technical-box strong {
        display: block;
        font-size: 0.875rem;
        color: #374151;
        margin-bottom: 4px;
      }

      .reasoning-box p,
      .technical-box p {
        font-size: 0.85rem;
        color: #6b7280;
        margin: 0;
        line-height: 1.5;
      }

      .toggle-details {
        width: 100%;
        padding: 12px;
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 600;
        color: #374151;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .toggle-details:hover {
        background: #e5e7eb;
      }

      .result-box {
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        border: 2px solid #86efac;
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        margin-top: 24px;
      }

      .result-icon {
        font-size: 3rem;
        margin-bottom: 12px;
      }

      .result-text {
        font-size: 1rem;
        color: #166534;
        font-weight: 600;
        margin-bottom: 8px;
      }

      .result-time {
        font-size: 0.875rem;
        color: #15803d;
      }
    `,
  ],
})
export class TransparentLoadingComponent {
  isLoading = input.required<boolean>();
  steps = input.required<LoadingStep[]>();
  progress = input.required<number>();
  timeRemaining = input.required<number>();
  result = input<string | null>();
  duration = input<number>(0);

  generate = output<void>();

  protected readonly showDetails = signal(false);

  protected onGenerate(): void {
    this.generate.emit();
  }

  protected toggleDetails(): void {
    this.showDetails.update((show) => !show);
  }

  protected getStepClass(step: LoadingStep): string {
    return step.status;
  }

  protected formatTime(ms: number): string {
    const seconds = Math.ceil(ms / 1000);
    return seconds > 0 ? `${seconds}s` : '0s';
  }
}
