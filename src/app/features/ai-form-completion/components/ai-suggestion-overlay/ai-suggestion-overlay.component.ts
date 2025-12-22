import { Component, input, output, signal, computed } from '@angular/core';
import { AISuggestion } from '../../models/ai-suggestion.model';
import { ConfidenceIndicatorComponent } from '../confidence-indicator/confidence-indicator.component';
import { FeedbackButtonsComponent } from '../feedback-buttons/feedback-buttons.component';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-ai-suggestion-overlay',
  imports: [ConfidenceIndicatorComponent, FeedbackButtonsComponent, FormsModule, NgClass],
  template: `
    <div class="ai-suggestion-overlay" [ngClass]="{ editing: isEditing() }">
      <!-- AI Badge -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="ai-badge">✨ AI Suggestion</span>
          @if (showReasoning()) {
            <app-confidence-indicator [confidence]="suggestion().confidence" />
          }
        </div>
        @if (showReasoning()) {
          <button type="button" class="explain-btn" (click)="toggleExplanation()">
            <span class="explain-icon">{{ showExplanation() ? '💡' : '🤔' }}</span>
            <span class="explain-text">{{ showExplanation() ? 'Hide' : 'Why this?' }}</span>
          </button>
        }
      </div>

      <!-- Explanation (collapsible) -->
      @if (showExplanation() && showReasoning()) {
        <div class="explanation-box">
          <p class="text-sm text-gray-700">{{ suggestion().explanation }}</p>
        </div>
      }

      <!-- Suggestion Text (view or edit mode) -->
      <div class="suggestion-content">
        @if (isEditing()) {
          <div class="edit-mode-header">
            <span class="edit-icon">✏️</span>
            <span class="edit-title">Edit AI Suggestion</span>
          </div>
          <textarea
            [(ngModel)]="editedText"
            class="edit-textarea"
            rows="6"
            placeholder="Modify the suggestion to better fit your needs..."
            autofocus
          ></textarea>
          <div class="edit-hint">
            💡 Tip: Make any changes you want, then save to apply your customized version
          </div>
        } @else {
          <div class="suggested-text">
            {{ suggestion().suggestedText }}
          </div>
        }
      </div>

      <!-- Action Buttons -->
      @if (showActions()) {
        <div class="action-buttons">
          @if (isEditing()) {
            <button type="button" class="btn btn-save" (click)="saveModification()">
              💾 Save Changes
            </button>
            <button type="button" class="btn btn-cancel" (click)="cancelEdit()">↩️ Cancel</button>
          } @else {
            <button type="button" class="btn btn-success" (click)="acceptSuggestion()">
              ✓ Accept
            </button>
            <button type="button" class="btn btn-primary" (click)="startEditing()">
              ✏️ Modify
            </button>
            <button type="button" class="btn btn-danger" (click)="rejectSuggestion()">
              ✗ Reject
            </button>
          }
        </div>
      } @else {
        <div class="read-only-badge">
          <span class="badge-icon">🔒</span>
          <span class="badge-text">Accept/Edit/Reject disabled - View only</span>
        </div>
      }

      <!-- Feedback Section -->
      @if (!isEditing() && showFeedback()) {
        <app-feedback-buttons
          [suggestionId]="suggestion().id"
          [field]="suggestion().field"
          (feedbackSubmitted)="onFeedbackSubmitted($event)"
        />
      }
    </div>
  `,
  styles: [
    `
      .ai-suggestion-overlay {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        background: white;
        border: 2px solid #667eea;
        border-radius: 12px;
        padding: 20px;
        margin-top: 12px;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        animation: slideIn 0.3s ease-out;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .ai-badge {
        display: inline-block;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 600;
      }

      .explain-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        margin-top: 10px;
        background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
        color: white;
        border: none;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 6px rgba(245, 158, 11, 0.3);
      }

      .explain-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
      }

      .explain-icon {
        font-size: 1.1rem;
        line-height: 1;
      }

      .explain-text {
        line-height: 1;
      }

      .explanation-box {
        background: #f3f4f6;
        border-left: 4px solid #667eea;
        padding: 12px;
        margin-bottom: 16px;
        border-radius: 4px;
        animation: expandDown 0.2s ease-out;
      }

      @keyframes expandDown {
        from {
          opacity: 0;
          max-height: 0;
        }
        to {
          opacity: 1;
          max-height: 200px;
        }
      }

      .suggestion-content {
        margin: 16px 0;
      }

      .edit-mode-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        border: 2px solid #3b82f6;
        border-radius: 8px 8px 0 0;
        margin-bottom: -2px;
      }

      .edit-icon {
        font-size: 1.3rem;
      }

      .edit-title {
        font-weight: 700;
        color: #1e40af;
        font-size: 1rem;
      }

      .edit-textarea {
        width: 100%;
        padding: 16px;
        border: 2px solid #3b82f6;
        border-radius: 0 0 8px 8px;
        font-size: 0.95rem;
        line-height: 1.6;
        color: #1f2937;
        resize: vertical;
        min-height: 120px;
        font-family: inherit;
        transition: all 0.2s ease;
      }

      .edit-textarea:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .edit-hint {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
        padding: 10px 14px;
        background: #fef3c7;
        border-left: 4px solid #f59e0b;
        border-radius: 4px;
        font-size: 0.85rem;
        color: #92400e;
        line-height: 1.4;
      }

      .suggested-text {
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        padding: 16px;
        border-radius: 8px;
        font-size: 0.95rem;
        line-height: 1.6;
        color: #374151;
      }

      .action-buttons {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        flex: 1;
        min-width: 100px;
      }

      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      .btn-success {
        background: #10b981;
        color: white;
      }

      .btn-success:hover {
        background: #059669;
      }

      .btn-primary {
        background: #3b82f6;
        color: white;
      }

      .btn-primary:hover {
        background: #2563eb;
      }

      .btn-danger {
        background: #ef4444;
        color: white;
      }

      .btn-danger:hover {
        background: #dc2626;
      }

      .btn-save {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        font-weight: 700;
        flex: 2;
      }

      .btn-save:hover {
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
      }

      .btn-cancel {
        background: #f3f4f6;
        color: #374151;
        border: 2px solid #d1d5db;
      }

      .btn-cancel:hover {
        background: #e5e7eb;
        border-color: #9ca3af;
      }

      .btn-secondary {
        background: #6b7280;
        color: white;
      }

      .btn-secondary:hover {
        background: #4b5563;
      }

      .editing {
        border-color: #3b82f6;
        box-shadow:
          0 0 0 3px rgba(59, 130, 246, 0.1),
          0 4px 16px rgba(59, 130, 246, 0.2);
        animation: pulseEdit 0.5s ease-out;
      }

      @keyframes pulseEdit {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.01);
        }
      }
    `,
  ],
})
export class AiSuggestionOverlayComponent {
  suggestion = input.required<AISuggestion>();
  showReasoning = input<boolean>(true);
  showFeedback = input<boolean>(true);
  showActions = input<boolean>(true);

  accept = output<string>();
  modify = output<string>();
  reject = output<void>();

  protected readonly isEditing = signal(false);
  protected readonly showExplanation = signal(false);
  protected editedText = '';

  acceptSuggestion(): void {
    this.accept.emit(this.suggestion().suggestedText);
  }

  startEditing(): void {
    this.editedText = this.suggestion().suggestedText;
    this.isEditing.set(true);
  }

  saveModification(): void {
    if (this.editedText.trim()) {
      this.modify.emit(this.editedText.trim());
      this.isEditing.set(false);
    }
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.editedText = '';
  }

  rejectSuggestion(): void {
    this.reject.emit();
  }

  toggleExplanation(): void {
    this.showExplanation.update((show) => !show);
  }

  onFeedbackSubmitted(type: string): void {
    console.log(`Feedback ${type} submitted for suggestion ${this.suggestion().id}`);
  }
}
