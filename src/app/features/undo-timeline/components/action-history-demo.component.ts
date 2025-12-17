import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ActionHistoryService } from '../services/action-history.service';
import { AIAction } from '../models/action.model';

@Component({
  selector: 'app-action-history-demo',
  imports: [FormsModule],
  template: `
    <div class="demo-container">
      <!-- Header -->
      <div class="header">
        <h1 class="title">AI Action History + Selective Undo</h1>
        <p class="subtitle">Track and selectively undo any AI action</p>
      </div>

      <!-- Main Content -->
      <div class="demo-content">
        <!-- Left: Form with AI Actions -->
        <div class="form-section">
          <div class="form-card">
            <h2 class="form-title">Blog Post Editor</h2>

            <!-- Title Field -->
            <div class="field-group">
              <label>Title</label>
              <input
                type="text"
                [(ngModel)]="titleInput"
                placeholder="Enter blog post title..."
                class="input-field"
              />
              <div class="ai-actions">
                <button (click)="generateTitle()" class="ai-btn">✨ Generate Title</button>
                <button (click)="enhanceTitle()" class="ai-btn">🎯 Enhance Title</button>
              </div>
            </div>

            <!-- Description Field -->
            <div class="field-group">
              <label>Description</label>
              <textarea
                [(ngModel)]="descriptionInput"
                rows="4"
                placeholder="Enter blog post description..."
                class="textarea-field"
              ></textarea>
              <div class="ai-actions">
                <button (click)="generateDescription()" class="ai-btn">
                  ✨ Generate Description
                </button>
                <button (click)="expandDescription()" class="ai-btn">📝 Expand Content</button>
              </div>
            </div>

            <!-- Tags Field -->
            <div class="field-group">
              <label>Tags</label>
              <input
                type="text"
                [(ngModel)]="tagsInput"
                placeholder="Enter tags..."
                class="input-field"
              />
              <div class="ai-actions">
                <button (click)="suggestTags()" class="ai-btn">🏷️ Suggest Tags</button>
              </div>
            </div>

            <!-- Current State Display -->
            @if (historyService.hasActions()) {
            <div class="current-state">
              <h3 class="state-title">Current State</h3>
              <div class="state-preview">
                @if (currentTitle()) {
                <div class="preview-item"><strong>Title:</strong> {{ currentTitle() }}</div>
                } @if (currentDescription()) {
                <div class="preview-item">
                  <strong>Description:</strong> {{ currentDescription() }}
                </div>
                } @if (currentTags()) {
                <div class="preview-item"><strong>Tags:</strong> {{ currentTags() }}</div>
                }
              </div>
            </div>
            }

            <!-- Action Buttons -->
            <div class="action-buttons">
              @if (historyService.hasActions() && !isPublished()) {
              <button (click)="publishPost()" class="btn-publish">🚀 Publish Post</button>
              } @if (isPublished()) {
              <div class="published-message">
                <span class="published-icon">✓</span>
                <span class="published-text">Post published successfully!</span>
              </div>
              } @if (historyService.hasActions()) {
              <button (click)="clearAll()" class="btn-clear">🗑️ Clear All</button>
              }
            </div>
          </div>
        </div>

        <!-- Right: Action History Timeline -->
        <div class="history-section">
          <div class="history-card">
            <h2 class="history-title">
              Action History @if (historyService.hasActions()) {
              <span class="action-count">{{ actionHistory().length }}</span>
              }
            </h2>

            @if (!historyService.hasActions()) {
            <div class="empty-state">
              <span class="empty-icon">📋</span>
              <p class="empty-text">No actions yet</p>
              <p class="empty-hint">Use AI buttons to generate content</p>
            </div>
            } @else {
            <div class="timeline">
              @for (action of actionHistory(); track action.id; let idx = $index) {
              <div class="action-item" [class.highlight]="highlightedAction() === action.id">
                <div class="action-header">
                  <div class="action-info">
                    <span class="action-icon">{{ getActionIcon(action.type) }}</span>
                    <div class="action-details">
                      <h4 class="action-title">{{ action.title }}</h4>
                      <p class="action-time">{{ formatTime(action.timestamp) }}</p>
                    </div>
                  </div>
                  <button
                    (click)="undoAction(action.id)"
                    (mouseenter)="highlightedAction.set(action.id)"
                    (mouseleave)="highlightedAction.set(null)"
                    class="undo-btn"
                    title="Undo this action"
                  >
                    ↶
                  </button>
                </div>

                <div class="action-description">{{ action.description }}</div>

                <div class="action-changes">
                  <div class="change-item previous">
                    <span class="change-label">Before:</span>
                    <span class="change-value">{{ action.previousValue || '(empty)' }}</span>
                  </div>
                  <div class="change-arrow">→</div>
                  <div class="change-item new">
                    <span class="change-label">After:</span>
                    <span class="change-value">{{ action.newValue }}</span>
                  </div>
                </div>

                @if (idx < actionHistory().length - 1) {
                <div class="action-divider"></div>
                }
              </div>
              }
            </div>
            } @if (historyService.hasActions()) { }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .demo-container {
        min-height: 100vh;
        padding: 40px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .header {
        max-width: 1400px;
        margin: 0 auto 40px;
        text-align: center;
      }

      .back-button {
        display: inline-block;
        color: white;
        text-decoration: none;
        font-weight: 600;
        margin-bottom: 20px;
        padding: 8px 16px;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.2);
        transition: all 0.2s ease;
      }

      .back-button:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateX(-4px);
      }

      .title {
        color: white;
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 12px 0;
      }

      .subtitle {
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.25rem;
        margin: 0;
      }

      .demo-content {
        max-width: 1400px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        align-items: start;
      }

      @media (max-width: 1100px) {
        .demo-content {
          grid-template-columns: 1fr;
        }
      }

      /* Form Section */
      .form-card,
      .history-card {
        background: white;
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      .form-title,
      .history-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0 0 24px 0;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .action-count {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-size: 0.875rem;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 20px;
        min-width: 28px;
      }

      .field-group {
        margin-bottom: 28px;
      }

      .field-group label {
        display: block;
        font-size: 0.875rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
      }

      .input-field,
      .textarea-field {
        width: 100%;
        padding: 12px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 0.95rem;
        font-family: inherit;
        transition: all 0.2s ease;
        margin-bottom: 12px;
      }

      .input-field:focus,
      .textarea-field:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .textarea-field {
        resize: vertical;
      }

      .ai-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .ai-btn {
        padding: 8px 16px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }

      .ai-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }

      .current-state {
        margin-top: 32px;
        padding: 20px;
        background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
        border: 2px solid #667eea;
        border-radius: 12px;
      }

      .state-title {
        font-size: 1rem;
        font-weight: 700;
        color: #4338ca;
        margin: 0 0 12px 0;
      }

      .state-preview {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .preview-item {
        font-size: 0.875rem;
        color: #374151;
        line-height: 1.5;
      }

      .preview-item strong {
        color: #1f2937;
      }

      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 20px;
      }

      .btn-publish {
        width: 100%;
        padding: 14px 24px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }

      .btn-publish:hover {
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
      }

      .published-message {
        width: 100%;
        padding: 16px 24px;
        background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        border: 2px solid #10b981;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
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

      .published-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: #10b981;
        color: white;
        border-radius: 50%;
        font-weight: 700;
        font-size: 1.125rem;
      }

      .published-text {
        font-size: 1rem;
        font-weight: 700;
        color: #065f46;
      }

      .btn-clear {
        width: 100%;
        padding: 12px 24px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 0.95rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .btn-clear:hover {
        background: #dc2626;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }

      /* History Section */
      .empty-state {
        text-align: center;
        padding: 60px 20px;
      }

      .empty-icon {
        font-size: 4rem;
        display: block;
        margin-bottom: 16px;
        opacity: 0.5;
      }

      .empty-text {
        font-size: 1.125rem;
        font-weight: 600;
        color: #6b7280;
        margin: 0 0 8px 0;
      }

      .empty-hint {
        font-size: 0.875rem;
        color: #9ca3af;
        margin: 0;
      }

      .timeline {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      .action-item {
        padding: 20px;
        transition: all 0.2s ease;
        border-radius: 8px;
      }

      .action-item.highlight {
        background: #fef3c7;
        transform: scale(1.02);
      }

      .action-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
      }

      .action-info {
        display: flex;
        gap: 12px;
        flex: 1;
      }

      .action-icon {
        font-size: 1.5rem;
        line-height: 1;
      }

      .action-details {
        flex: 1;
      }

      .action-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0 0 4px 0;
      }

      .action-time {
        font-size: 0.75rem;
        color: #9ca3af;
        margin: 0;
      }

      .undo-btn {
        padding: 8px 12px;
        background: white;
        color: #f59e0b;
        border: 2px solid #f59e0b;
        border-radius: 8px;
        font-size: 1.25rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
        line-height: 1;
      }

      .undo-btn:hover {
        background: #f59e0b;
        color: white;
        transform: scale(1.1) rotate(-15deg);
      }

      .action-description {
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 12px;
        padding-left: 44px;
      }

      .action-changes {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 12px;
        align-items: center;
        padding: 12px;
        background: #f9fafb;
        border-radius: 8px;
        margin-left: 44px;
      }

      .change-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .change-label {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .change-item.previous .change-label {
        color: #ef4444;
      }

      .change-item.new .change-label {
        color: #10b981;
      }

      .change-value {
        font-size: 0.8125rem;
        color: #374151;
        word-break: break-word;
      }

      .change-arrow {
        font-size: 1.25rem;
        color: #9ca3af;
        font-weight: 700;
      }

      .action-divider {
        height: 1px;
        background: #e5e7eb;
        margin: 20px 0 0 44px;
      }

      .key-insight {
        margin-top: 24px;
        padding: 16px;
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        border: 2px solid #f59e0b;
        border-radius: 12px;
        display: flex;
        gap: 12px;
      }

      .insight-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .insight-text {
        font-size: 0.875rem;
        color: #78350f;
        line-height: 1.6;
        margin: 0;
      }

      .insight-text strong {
        color: #92400e;
      }
    `,
  ],
})
export class ActionHistoryDemoComponent {
  protected readonly historyService = inject(ActionHistoryService);

  protected readonly titleInput = signal('');
  protected readonly descriptionInput = signal('');
  protected readonly tagsInput = signal('');
  protected readonly highlightedAction = signal<string | null>(null);
  protected readonly isPublished = signal(false);

  protected readonly actionHistory = computed(() => this.historyService.actionHistory());
  protected readonly currentTitle = computed(() => this.historyService.fieldValues()['title']);
  protected readonly currentDescription = computed(
    () => this.historyService.fieldValues()['description']
  );
  protected readonly currentTags = computed(() => this.historyService.fieldValues()['tags']);

  // AI Action Simulations
  generateTitle(): void {
    const previous = this.titleInput();
    const newTitle = 'AI-Powered Design Patterns: Building Intelligent User Interfaces';

    this.historyService.addAction(
      'text-generated',
      'Generated Title',
      'AI created a new title based on context',
      'title',
      previous,
      newTitle
    );

    this.titleInput.set(newTitle);
  }

  enhanceTitle(): void {
    const previous = this.titleInput();
    const enhanced = previous + ' - A Comprehensive Guide';

    this.historyService.addAction(
      'text-edited',
      'Enhanced Title',
      'AI added descriptive enhancement',
      'title',
      previous,
      enhanced
    );

    this.titleInput.set(enhanced);
  }

  generateDescription(): void {
    const previous = this.descriptionInput();
    const newDesc = '';

    this.historyService.addAction(
      'text-generated',
      'Generated Description',
      'AI created full description from title',
      'description',
      previous,
      newDesc
    );

    this.descriptionInput.set(newDesc);
  }

  expandDescription(): void {
    const previous = this.descriptionInput();
    const expanded =
      previous +
      ' Discover real-world examples, expert insights, and actionable strategies to implement AI-powered features in your products.';

    this.historyService.addAction(
      'text-edited',
      'Expanded Description',
      'AI added more context and details',
      'description',
      previous,
      expanded
    );

    this.descriptionInput.set(expanded);
  }

  suggestTags(): void {
    const previous = this.tagsInput();
    const tags = 'AI, UX Design, Design Patterns, User Interface, Machine Learning, Best Practices';

    this.historyService.addAction(
      'suggestion-accepted',
      'Suggested Tags',
      'AI analyzed content and suggested relevant tags',
      'tags',
      previous,
      tags
    );

    this.tagsInput.set(tags);
  }

  undoAction(actionId: string): void {
    const action = this.actionHistory().find((a) => a.id === actionId);
    if (!action) return;

    this.historyService.undoAction(actionId);

    // Update form inputs
    const currentValues = this.historyService.fieldValues();
    this.titleInput.set(currentValues['title'] || '');
    this.descriptionInput.set(currentValues['description'] || '');
    this.tagsInput.set(currentValues['tags'] || '');
  }

  publishPost(): void {
    this.isPublished.set(true);
    // Simulate publish delay
    setTimeout(() => {
      // Could add additional success logic here
    }, 300);
  }

  clearAll(): void {
    this.historyService.clear();
    this.titleInput.set('');
    this.descriptionInput.set('');
    this.tagsInput.set('');
    this.isPublished.set(false);
  }

  getActionIcon(type: string): string {
    const icons: Record<string, string> = {
      'text-generated': '✨',
      'text-edited': '✏️',
      'suggestion-accepted': '✓',
      'auto-completed': '🤖',
      'data-enhanced': '🎯',
    };
    return icons[type] || '📝';
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    return `${Math.floor(seconds / 3600)} hour ago`;
  }
}
