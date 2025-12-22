import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AiSuggestionService } from '../../services/ai-suggestion.service';
import { FormStateService } from '../../services/form-state.service';
import { AiSuggestionOverlayComponent } from '../ai-suggestion-overlay/ai-suggestion-overlay.component';
import { AISuggestion } from '../../models/ai-suggestion.model';
import { ProfileFormData } from '../../models/form-data.model';
import { NgClass } from '@angular/common';

type FormField = keyof ProfileFormData;

@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule, AiSuggestionOverlayComponent, NgClass],
  template: `
    <div class="profile-form-container">
      <div class="layout-wrapper">
        <!-- Sidebar with Feature Info -->
        <aside class="sidebar">
          <!-- Master Toggle -->
          <div class="master-toggle">
            <label class="toggle-label">
              <input
                type="checkbox"
                [checked]="!aiEnabled()"
                (change)="toggleAI()"
                class="toggle-input"
              />
              <span class="toggle-text">🚫 Disable AI Support (Classic Form)</span>
            </label>
          </div>

          <!-- Feature Toggles -->
          <div class="features-control">
            <!-- Accept Edit Reject Toggle -->
            <div class="info-section" [class.disabled]="!aiEnabled()">
              <div class="section-header">
                <h2 class="section-title">Accept Edit Reject</h2>
                <label class="feature-toggle">
                  <input
                    type="checkbox"
                    [checked]="acceptEditRejectEnabled()"
                    (change)="toggleFeature('acceptEditReject')"
                    [disabled]="!aiEnabled()"
                    class="toggle-input small"
                  />
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <p class="section-subtitle">AI suggests content, but you stay in control.</p>
              <ul class="feature-points">
                <li>Review AI suggestions before applying them.</li>
                <li>Accept, edit, or reject each suggestion.</li>
                <li>AI explains why a suggestion was made.</li>
              </ul>
            </div>

            <!-- Reasoning & Confidence Section -->
            <div class="info-section" [class.disabled]="!aiEnabled()">
              <div class="section-header">
                <h2 class="section-title">Reasoning + Confidence</h2>
                <label class="feature-toggle">
                  <input
                    type="checkbox"
                    [checked]="reasoningEnabled()"
                    (change)="toggleFeature('reasoning')"
                    [disabled]="!aiEnabled()"
                    class="toggle-input small"
                  />
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <p class="section-subtitle">Transparency builds trust.</p>
              <ul class="section-points">
                <li>See why the AI made this suggestion.</li>
                <li>Confidence levels help you decide how much to trust it.</li>
                <li>AI uncertainty is visible, not hidden.</li>
              </ul>
            </div>

            <!-- Feedback Section -->
            <div class="info-section" [class.disabled]="!aiEnabled()">
              <div class="section-header">
                <h2 class="section-title">Feedback System</h2>
                <label class="feature-toggle">
                  <input
                    type="checkbox"
                    [checked]="feedbackEnabled()"
                    (change)="toggleFeature('feedback')"
                    [disabled]="!aiEnabled()"
                    class="toggle-input small"
                  />
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <p class="section-subtitle">Your feedback is part of the experience.</p>
              <ul class="section-points">
                <li>Quick feedback helps evaluate AI suggestions.</li>
                <li>Like or dislike to express usefulness.</li>
                <li>Report issues when something feels wrong.</li>
              </ul>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="main-content">
          <!-- Quick Examples -->
          <div class="quick-examples">
            <span class="examples-label">Try an example:</span>
            <button type="button" class="example-btn" (click)="loadExample('login')">
              🔐 Login Issue
            </button>
            <button type="button" class="example-btn" (click)="loadExample('billing')">
              💳 Billing Problem
            </button>
            <button type="button" class="example-btn" (click)="loadExample('technical')">
              ⚠️ Technical Error
            </button>
            <button type="button" class="example-btn" (click)="loadExample('vague')">
              ❓ Vague Request
            </button>
          </div>

          <!-- Form -->
          <form [formGroup]="profileForm" class="form">
            <!-- Subject Field -->
            <div class="form-field">
              <label for="subject" class="label"> Subject <span class="required">*</span> </label>
              <div class="input-group">
                <input
                  id="subject"
                  type="text"
                  formControlName="subject"
                  (blur)="onFieldBlur('subject')"
                  class="input"
                  placeholder="Brief description of your issue"
                  [ngClass]="{ 'has-suggestion': currentSuggestion()?.field === 'subject' }"
                />
                @if (aiEnabled()) {
                  <button
                    type="button"
                    class="suggest-btn"
                    [disabled]="isLoadingSuggestion() || !profileForm.get('subject')?.value"
                    (click)="requestSuggestion('subject')"
                  >
                    @if (isLoadingSuggestion() && currentField() === 'subject') {
                      <span class="spinner"></span> Loading...
                    } @else {
                      ✨ Get AI Suggestion
                    }
                  </button>
                }
              </div>
              @if (currentSuggestion()?.field === 'subject') {
                <app-ai-suggestion-overlay
                  [suggestion]="currentSuggestion()!"
                  [showReasoning]="reasoningEnabled()"
                  [showFeedback]="feedbackEnabled()"
                  [showActions]="acceptEditRejectEnabled()"
                  (accept)="acceptSuggestion($event)"
                  (modify)="modifySuggestion($event)"
                  (reject)="rejectSuggestion()"
                />
              }
            </div>

            <!-- Description Field -->
            <div class="form-field">
              <label for="description" class="label">
                Description <span class="required">*</span>
              </label>
              <div class="input-group">
                <textarea
                  id="description"
                  formControlName="description"
                  (blur)="onFieldBlur('description')"
                  class="textarea"
                  rows="8"
                  placeholder="Describe your issue in detail... What happened? When did it start? What have you tried?"
                  [ngClass]="{ 'has-suggestion': currentSuggestion()?.field === 'description' }"
                ></textarea>
                @if (aiEnabled()) {
                  <button
                    type="button"
                    class="suggest-btn"
                    [disabled]="isLoadingSuggestion() || !profileForm.get('description')?.value"
                    (click)="requestSuggestion('description')"
                  >
                    @if (isLoadingSuggestion() && currentField() === 'description') {
                      <span class="spinner"></span> Loading...
                    } @else {
                      ✨ Get AI Suggestion
                    }
                  </button>
                }
              </div>
              @if (currentSuggestion()?.field === 'description') {
                <app-ai-suggestion-overlay
                  [suggestion]="currentSuggestion()!"
                  [showReasoning]="reasoningEnabled()"
                  [showFeedback]="feedbackEnabled()"
                  [showActions]="acceptEditRejectEnabled()"
                  (accept)="acceptSuggestion($event)"
                  (modify)="modifySuggestion($event)"
                  (reject)="rejectSuggestion()"
                />
              }
            </div>

            <!-- Action Buttons -->
            <div class="form-actions">
              <button type="button" class="btn btn-reset" (click)="resetForm()">
                🔄 Reset Form
              </button>
              <button
                type="submit"
                class="btn btn-submit"
                [disabled]="!profileForm.valid"
                (click)="submitForm()"
              >
                📨 Submit Ticket
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-form-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 24px;
      }

      .layout-wrapper {
        display: grid;
        grid-template-columns: 350px 1fr;
        gap: 32px;
        align-items: start;
      }

      .sidebar {
        position: sticky;
        top: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .master-toggle {
        background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        padding: 16px;
        border-radius: 12px;
        border: 2px solid #f59e0b;
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
      }

      .toggle-label {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        font-weight: 600;
        color: #92400e;
      }

      .toggle-input {
        width: 20px;
        height: 20px;
        cursor: pointer;
      }

      .toggle-text {
        font-size: 1rem;
      }

      .features-control {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .control-title {
        font-size: 1.2rem;
        font-weight: 700;
        color: #1f2937;
        margin: 0;
        padding: 0 20px;
      }

      .info-section.disabled {
        opacity: 0.5;
        pointer-events: none;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
      }

      .feature-toggle {
        display: inline-flex;
        align-items: center;
        position: relative;
        cursor: pointer;
      }

      .toggle-input.small {
        width: 0;
        height: 0;
        opacity: 0;
        position: absolute;
      }

      .toggle-slider {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 24px;
        background: #cbd5e0;
        border-radius: 24px;
        transition: background 0.3s;
      }

      .toggle-slider::before {
        content: '';
        position: absolute;
        width: 18px;
        height: 18px;
        left: 3px;
        top: 3px;
        background: white;
        border-radius: 50%;
        transition: transform 0.3s;
      }

      .toggle-input:checked + .toggle-slider {
        background: #667eea;
      }

      .toggle-input:checked + .toggle-slider::before {
        transform: translateX(20px);
      }

      .toggle-input:disabled + .toggle-slider {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .main-content {
        min-width: 0;
      }

      .feature-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 8px;
      }

      .feature-subtitle {
        font-size: 0.95rem;
        margin-bottom: 12px;
        opacity: 0.95;
      }

      .feature-points {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .feature-points li {
        padding: 6px 0;
        padding-left: 20px;
        position: relative;
        font-size: 0.85rem;
        opacity: 0.9;
      }

      .feature-points li::before {
        content: '✓';
        position: absolute;
        left: 0;
        font-weight: bold;
        color: #a5f3fc;
      }

      .info-section {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        border-left: 4px solid #667eea;
      }

      .section-title {
        font-size: 1.1rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 6px;
      }

      .section-subtitle {
        font-size: 0.9rem;
        color: #6b7280;
        margin-bottom: 10px;
        font-style: italic;
      }

      .section-points {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .section-points li {
        padding: 5px 0;
        padding-left: 20px;
        position: relative;
        font-size: 0.85rem;
        color: #4b5563;
      }

      .section-points li::before {
        content: '•';
        position: absolute;
        left: 8px;
        color: #667eea;
        font-weight: bold;
      }

      .quick-examples {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        padding: 16px 20px;
        border-radius: 12px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        border: 2px solid #bae6fd;
      }

      .examples-label {
        font-weight: 600;
        color: #0c4a6e;
        font-size: 0.95rem;
      }

      .example-btn {
        padding: 8px 16px;
        background: white;
        color: #0369a1;
        border: 2px solid #0ea5e9;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .example-btn:hover {
        background: #0ea5e9;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
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

      .form {
        background: white;
        border-radius: 12px;
        padding: 32px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .form-field {
        margin-bottom: 24px;
      }

      .label {
        display: block;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
        font-size: 0.95rem;
      }

      .required {
        color: #ef4444;
      }

      .input-group {
        display: flex;
        gap: 12px;
        align-items: flex-start;
      }

      .input,
      .textarea {
        flex: 1;
        padding: 12px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.2s ease;
      }

      .input:focus,
      .textarea:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .input.has-suggestion,
      .textarea.has-suggestion {
        border-color: #667eea;
        background: #f9fafb;
      }

      .textarea {
        resize: vertical;
        min-height: 100px;
      }

      .suggest-btn {
        padding: 12px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .suggest-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .suggest-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
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

      .form-actions {
        display: flex;
        gap: 12px;
        margin-top: 32px;
        padding-top: 24px;
        border-top: 2px solid #e5e7eb;
      }

      .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        flex: 1;
      }

      .btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }

      .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .btn-reset {
        background: #6b7280;
        color: white;
      }

      .btn-submit {
        background: #10b981;
        color: white;
      }
    `,
  ],
})
export class ProfileFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly aiService = inject(AiSuggestionService);
  private readonly formStateService = inject(FormStateService);

  protected readonly profileForm: FormGroup;
  protected readonly currentSuggestion = signal<AISuggestion | null>(null);
  protected readonly currentField = signal<FormField | null>(null);
  protected readonly isLoadingSuggestion = computed(() => this.aiService.loading());

  // Feature toggles
  protected readonly aiEnabled = signal(true);
  protected readonly acceptEditRejectEnabled = signal(true);
  protected readonly reasoningEnabled = signal(true);
  protected readonly feedbackEnabled = signal(true);

  constructor() {
    // Initialize form with validators
    this.profileForm = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
    });

    // Sync form changes with state service
    this.profileForm.valueChanges.subscribe((values) => {
      // Skip tracking during loading
      if (this.isLoadingSuggestion()) {
        return;
      }

      // Only update if changed by user (not programmatically)
      Object.keys(values).forEach((key) => {
        const field = key as FormField;
        const currentValue = this.formStateService.getFieldValue(field);
        if (values[field] !== currentValue) {
          this.formStateService.updateField(field, values[field] || '', 'user');
        }
      });
    });
  }

  async requestSuggestion(field: FormField): Promise<void> {
    const currentValue = this.profileForm.get(field)?.value;
    if (!currentValue || currentValue.trim().length === 0) {
      return;
    }

    this.currentField.set(field);
    this.currentSuggestion.set(null);

    try {
      const formContext = this.profileForm.value as Partial<ProfileFormData>;
      const suggestion = await this.aiService.generateSuggestion(field, currentValue, formContext);

      this.currentSuggestion.set(suggestion);
    } catch (error) {
      console.error('Failed to generate suggestion:', error);
      alert('Failed to generate AI suggestion. Please try again.');
    }
  }

  acceptSuggestion(suggestedText: string): void {
    const field = this.currentSuggestion()?.field as FormField;
    if (!field) return;

    this.profileForm.patchValue({ [field]: suggestedText });
    this.formStateService.updateField(field, suggestedText, 'ai');
    this.currentSuggestion.set(null);
    this.currentField.set(null);
  }

  modifySuggestion(modifiedText: string): void {
    const field = this.currentSuggestion()?.field as FormField;
    if (!field) return;

    this.profileForm.patchValue({ [field]: modifiedText });
    this.formStateService.updateField(field, modifiedText, 'ai');
    this.currentSuggestion.set(null);
    this.currentField.set(null);
  }

  rejectSuggestion(): void {
    this.currentSuggestion.set(null);
    this.currentField.set(null);
  }

  resetForm(): void {
    if (confirm('Are you sure you want to reset the entire form? All data will be lost.')) {
      this.profileForm.reset();
      this.formStateService.reset();
      this.currentSuggestion.set(null);
      this.currentField.set(null);
    }
  }

  submitForm(): void {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      console.log('Support ticket submitted:', formData);
      alert(
        '✅ Support ticket submitted successfully!\n\nOur team will review your request shortly.\n\nCheck the console for details.',
      );
    }
  }

  loadExample(type: 'login' | 'billing' | 'technical' | 'vague'): void {
    const examples = {
      login: {
        subject: 'cant login',
        description: 'i tried to login but it doesnt work',
      },
      billing: {
        subject: 'charged twice',
        description:
          'I was charged twice for my subscription last month. The payment went through on March 15th.',
      },
      technical: {
        subject: 'app crashing',
        description:
          'The app keeps crashing when I try to upload files. It happens every time I select a file larger than 5MB.',
      },
      vague: {
        subject: 'help',
        description: 'need help with something',
      },
    };

    this.profileForm.patchValue(examples[type]);
  }

  toggleAI(): void {
    this.aiEnabled.update((v) => !v);
    if (!this.aiEnabled()) {
      // Disable all features when AI is off
      this.acceptEditRejectEnabled.set(false);
      this.reasoningEnabled.set(false);
      this.feedbackEnabled.set(false);
      // Clear any active suggestions
      this.currentSuggestion.set(null);
      this.currentField.set(null);
    } else {
      // Re-enable all features when AI is turned back on
      this.acceptEditRejectEnabled.set(true);
      this.reasoningEnabled.set(true);
      this.feedbackEnabled.set(true);
    }
  }

  toggleFeature(feature: 'acceptEditReject' | 'reasoning' | 'feedback'): void {
    if (!this.aiEnabled()) return;

    switch (feature) {
      case 'acceptEditReject':
        this.acceptEditRejectEnabled.update((v) => !v);
        break;
      case 'reasoning':
        this.reasoningEnabled.update((v) => !v);
        break;
      case 'feedback':
        this.feedbackEnabled.update((v) => !v);
        break;
    }
  }

  onFieldBlur(field: FormField): void {
    // Optional: Could trigger auto-suggestion on blur
    // For now, user needs to click the button explicitly
  }
}
