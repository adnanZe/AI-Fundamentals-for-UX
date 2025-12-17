import { Component, input, computed, signal } from '@angular/core';
import { ConfidenceLevel } from '../../models/ai-suggestion.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-confidence-indicator',
  imports: [NgClass],
  template: `
    <div
      class="confidence-container"
      (mouseenter)="showTooltip.set(true)"
      (mouseleave)="showTooltip.set(false)"
    >
      <div class="confidence-badge" [ngClass]="badgeClasses()">
        <div class="badge-content">
          <span class="confidence-icon">{{ confidenceIcon() }}</span>
          <div class="confidence-info">
            <span class="confidence-label">{{ confidenceLabel() }}</span>
            <span class="confidence-percentage">{{ confidencePercentage() }}%</span>
          </div>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            [ngClass]="progressClasses()"
            [style.width.%]="confidencePercentage()"
          ></div>
        </div>
      </div>

      @if (showTooltip()) {
      <div class="tooltip" [ngClass]="tooltipClasses()">
        <div class="tooltip-header">
          <span class="tooltip-icon">ℹ️</span>
          <strong>AI Confidence Level</strong>
        </div>
        <p class="tooltip-text">{{ tooltipText() }}</p>
        <div class="tooltip-stats">
          <span>Accuracy: {{ confidencePercentage() }}%</span>
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .confidence-container {
        position: relative;
        display: inline-block;
      }

      .confidence-badge {
        background: white;
        border-radius: 12px;
        padding: 10px 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        cursor: help;
        min-width: 160px;
      }

      .confidence-badge:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      }

      .badge-content {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
      }

      .confidence-icon {
        font-size: 1.25rem;
        line-height: 1;
      }

      .confidence-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
      }

      .confidence-label {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        opacity: 0.8;
      }

      .confidence-percentage {
        font-size: 1rem;
        font-weight: 700;
      }

      .high .confidence-label,
      .high .confidence-percentage {
        color: #059669;
      }

      .medium .confidence-label,
      .medium .confidence-percentage {
        color: #d97706;
      }

      .low .confidence-label,
      .low .confidence-percentage {
        color: #dc2626;
      }

      .progress-bar {
        width: 100%;
        height: 4px;
        background: #e5e7eb;
        border-radius: 2px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        border-radius: 2px;
        transition: width 0.6s ease, background-color 0.3s ease;
        animation: progressLoad 1s ease-out;
      }

      @keyframes progressLoad {
        from {
          width: 0%;
        }
      }

      .progress-fill.high {
        background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      }

      .progress-fill.medium {
        background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
      }

      .progress-fill.low {
        background: linear-gradient(90deg, #f87171 0%, #dc2626 100%);
      }

      .tooltip {
        position: absolute;
        top: calc(100% + 12px);
        left: 50%;
        transform: translateX(-50%);
        width: 280px;
        padding: 16px;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: tooltipFadeIn 0.2s ease-out;
        pointer-events: none;
      }

      @keyframes tooltipFadeIn {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-5px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }

      .tooltip::before {
        content: '';
        position: absolute;
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 12px;
        height: 12px;
        transform: translateX(-50%) rotate(45deg);
      }

      .tooltip.high {
        background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        border: 2px solid #10b981;
      }

      .tooltip.high::before {
        background: #d1fae5;
        border-left: 2px solid #10b981;
        border-top: 2px solid #10b981;
      }

      .tooltip.medium {
        background: linear-gradient(135deg, #fed7aa 0%, #fcd34d 100%);
        border: 2px solid #f59e0b;
      }

      .tooltip.medium::before {
        background: #fed7aa;
        border-left: 2px solid #f59e0b;
        border-top: 2px solid #f59e0b;
      }

      .tooltip.low {
        background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
        border: 2px solid #ef4444;
      }

      .tooltip.low::before {
        background: #fecaca;
        border-left: 2px solid #ef4444;
        border-top: 2px solid #ef4444;
      }

      .tooltip-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 0.875rem;
        font-weight: 700;
        color: #1f2937;
      }

      .tooltip-icon {
        font-size: 1rem;
      }

      .tooltip-text {
        font-size: 0.8125rem;
        line-height: 1.5;
        color: #374151;
        margin: 0 0 12px 0;
      }

      .tooltip-stats {
        padding-top: 12px;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        font-size: 0.8125rem;
        font-weight: 600;
        color: #1f2937;
      }
    `,
  ],
})
export class ConfidenceIndicatorComponent {
  confidence = input.required<ConfidenceLevel>();
  protected readonly showTooltip = signal(false);

  confidenceLabel = computed(() => {
    const level = this.confidence();
    return level.charAt(0).toUpperCase() + level.slice(1);
  });

  confidenceIcon = computed(() => {
    const level = this.confidence();
    switch (level) {
      case 'high':
        return '✓';
      case 'medium':
        return '!';
      case 'low':
        return '?';
    }
  });

  confidencePercentage = computed(() => {
    const level = this.confidence();
    switch (level) {
      case 'high':
        return 92;
      case 'medium':
        return 68;
      case 'low':
        return 43;
    }
  });

  badgeClasses = computed(() => {
    return this.confidence();
  });

  progressClasses = computed(() => {
    return this.confidence();
  });

  tooltipClasses = computed(() => {
    return this.confidence();
  });

  tooltipText = computed(() => {
    const level = this.confidence();
    switch (level) {
      case 'high':
        return 'This suggestion is highly reliable. The AI has strong confidence based on clear patterns and extensive data.';
      case 'medium':
        return 'This suggestion is moderately reliable. The AI has reasonable confidence but recommends review before accepting.';
      case 'low':
        return 'This suggestion has lower reliability. The AI suggests careful review and potential modification before use.';
    }
  });
}
