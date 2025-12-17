import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-simple-loading',
  imports: [],
  template: `
    <div class="simple-loading-container">
      <div class="content-box">
        <h3 class="title">❌ Traditional Loading</h3>
        <p class="subtitle">Simple spinner without context</p>

        <div class="action-area">
          @if (!isLoading()) {
          <button class="generate-btn" (click)="onGenerate()">Generate Content</button>
          } @else {
          <div class="loading-state">
            <div class="spinner"></div>
            <p class="loading-text">Loading...</p>
            <p class="wait-message">Please wait while we process your request</p>
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
      .simple-loading-container {
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
        background: #6b7280;
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .generate-btn:hover {
        background: #4b5563;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
      }

      .loading-state {
        text-align: center;
      }

      .spinner {
        width: 60px;
        height: 60px;
        border: 4px solid #e5e7eb;
        border-top-color: #6b7280;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 24px;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .loading-text {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 8px;
      }

      .wait-message {
        font-size: 0.95rem;
        color: #6b7280;
        font-style: italic;
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
export class SimpleLoadingComponent {
  isLoading = input.required<boolean>();
  result = input<string | null>();
  duration = input<number>(0);

  generate = output<void>();

  protected onGenerate(): void {
    this.generate.emit();
  }
}
