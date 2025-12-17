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
      <!-- Form -->
      <form [formGroup]="profileForm" class="form">
        <!-- Name Field -->
        <div class="form-field">
          <label for="name" class="label"> Full Name <span class="required">*</span> </label>
          <div class="input-group">
            <input
              id="name"
              type="text"
              formControlName="name"
              (blur)="onFieldBlur('name')"
              class="input"
              placeholder="Enter your full name"
              [ngClass]="{ 'has-suggestion': currentSuggestion()?.field === 'name' }"
            />
            <button
              type="button"
              class="suggest-btn"
              [disabled]="isLoadingSuggestion() || !profileForm.get('name')?.value"
              (click)="requestSuggestion('name')"
            >
              @if (isLoadingSuggestion() && currentField() === 'name') {
              <span class="spinner"></span> Loading... } @else { ✨ Get AI Suggestion }
            </button>
          </div>
          @if (currentSuggestion()?.field === 'name') {
          <app-ai-suggestion-overlay
            [suggestion]="currentSuggestion()!"
            (accept)="acceptSuggestion($event)"
            (modify)="modifySuggestion($event)"
            (reject)="rejectSuggestion()"
          />
          }
        </div>

        <!-- Role Field -->
        <div class="form-field">
          <label for="role" class="label">
            Professional Role <span class="required">*</span>
          </label>
          <div class="input-group">
            <input
              id="role"
              type="text"
              formControlName="role"
              (blur)="onFieldBlur('role')"
              class="input"
              placeholder="e.g., Frontend Developer"
              [ngClass]="{ 'has-suggestion': currentSuggestion()?.field === 'role' }"
            />
            <button
              type="button"
              class="suggest-btn"
              [disabled]="isLoadingSuggestion() || !profileForm.get('role')?.value"
              (click)="requestSuggestion('role')"
            >
              @if (isLoadingSuggestion() && currentField() === 'role') {
              <span class="spinner"></span> Loading... } @else { ✨ Get AI Suggestion }
            </button>
          </div>
          @if (currentSuggestion()?.field === 'role') {
          <app-ai-suggestion-overlay
            [suggestion]="currentSuggestion()!"
            (accept)="acceptSuggestion($event)"
            (modify)="modifySuggestion($event)"
            (reject)="rejectSuggestion()"
          />
          }
        </div>

        <!-- Bio Field -->
        <div class="form-field">
          <label for="bio" class="label"> Bio <span class="required">*</span> </label>
          <div class="input-group">
            <textarea
              id="bio"
              formControlName="bio"
              (blur)="onFieldBlur('bio')"
              class="textarea"
              rows="4"
              placeholder="Tell us about yourself..."
              [ngClass]="{ 'has-suggestion': currentSuggestion()?.field === 'bio' }"
            ></textarea>
            <button
              type="button"
              class="suggest-btn"
              [disabled]="isLoadingSuggestion() || !profileForm.get('bio')?.value"
              (click)="requestSuggestion('bio')"
            >
              @if (isLoadingSuggestion() && currentField() === 'bio') {
              <span class="spinner"></span> Loading... } @else { ✨ Get AI Suggestion }
            </button>
          </div>
          @if (currentSuggestion()?.field === 'bio') {
          <app-ai-suggestion-overlay
            [suggestion]="currentSuggestion()!"
            (accept)="acceptSuggestion($event)"
            (modify)="modifySuggestion($event)"
            (reject)="rejectSuggestion()"
          />
          }
        </div>

        <!-- Hobbies Field -->
        <div class="form-field">
          <label for="hobbies" class="label"> Hobbies & Interests </label>
          <div class="input-group">
            <input
              id="hobbies"
              type="text"
              formControlName="hobbies"
              (blur)="onFieldBlur('hobbies')"
              class="input"
              placeholder="e.g., reading, music, sports"
              [ngClass]="{ 'has-suggestion': currentSuggestion()?.field === 'hobbies' }"
            />
            <button
              type="button"
              class="suggest-btn"
              [disabled]="isLoadingSuggestion() || !profileForm.get('hobbies')?.value"
              (click)="requestSuggestion('hobbies')"
            >
              @if (isLoadingSuggestion() && currentField() === 'hobbies') {
              <span class="spinner"></span> Loading... } @else { ✨ Get AI Suggestion }
            </button>
          </div>
          @if (currentSuggestion()?.field === 'hobbies') {
          <app-ai-suggestion-overlay
            [suggestion]="currentSuggestion()!"
            (accept)="acceptSuggestion($event)"
            (modify)="modifySuggestion($event)"
            (reject)="rejectSuggestion()"
          />
          }
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <button type="button" class="btn btn-reset" (click)="resetForm()">🔄 Reset Form</button>
          <button
            type="submit"
            class="btn btn-submit"
            [disabled]="!profileForm.valid"
            (click)="submitForm()"
          >
            💾 Save Profile
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .profile-form-container {
        max-width: 800px;
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

  constructor() {
    // Initialize form with validators
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      bio: ['', [Validators.required, Validators.minLength(10)]],
      role: ['', [Validators.required, Validators.minLength(2)]],
      hobbies: [''],
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
      console.log('Profile submitted:', formData);
      alert('✅ Profile saved successfully!\n\nCheck the console for the submitted data.');
    }
  }

  onFieldBlur(field: FormField): void {
    // Optional: Could trigger auto-suggestion on blur
    // For now, user needs to click the button explicitly
  }
}
