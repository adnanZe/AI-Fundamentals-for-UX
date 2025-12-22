import { Injectable, signal, computed } from '@angular/core';
import { FormFieldChange, ProfileFormData } from '../models/form-data.model';

@Injectable({
  providedIn: 'root',
})
export class FormStateService {
  // Form state signals
  private readonly formData = signal<ProfileFormData>({
    subject: '',
    description: '',
  });

  // History for undo functionality
  private readonly history = signal<FormFieldChange[]>([]);

  // Read-only computed values
  readonly currentFormData = this.formData.asReadonly();
  readonly changeHistory = this.history.asReadonly();
  readonly canUndo = computed(() => {
    const hist = this.history();
    return hist.some((change) => change.source === 'ai');
  });
  readonly lastChange = computed(() => {
    const hist = this.history();
    return hist.length > 0 ? hist[hist.length - 1] : null;
  });

  /**
   * Updates a specific field in the form
   */
  updateField(field: keyof ProfileFormData, value: string, source: 'user' | 'ai' = 'user'): void {
    const oldValue = this.formData()[field];

    // Only track if value actually changed
    if (oldValue !== value) {
      // Record the change in history
      const change: FormFieldChange = {
        field,
        oldValue,
        newValue: value,
        timestamp: new Date(),
        source,
      };

      this.history.update((hist) => [...hist, change]);

      // Update form data
      this.formData.update((data) => ({
        ...data,
        [field]: value,
      }));
    }
  }

  /**
   * Undoes the last change (only AI changes can be undone)
   */
  undoLastChange(): boolean {
    const hist = this.history();
    if (hist.length === 0) return false;

    // Find the last AI change
    const lastAIChangeIndex = this.findLastAIChangeIndex(hist);
    if (lastAIChangeIndex === -1) return false;

    const change = hist[lastAIChangeIndex];

    // Restore old value
    this.formData.update((data) => ({
      ...data,
      [change.field]: change.oldValue,
    }));

    // Remove from history
    this.history.update((hist) => hist.filter((_, index) => index !== lastAIChangeIndex));

    return true;
  }

  /**
   * Gets the current value of a specific field
   */
  getFieldValue(field: keyof ProfileFormData): string {
    return this.formData()[field];
  }

  /**
   * Gets all form data as a plain object
   */
  getAllFormData(): ProfileFormData {
    return { ...this.formData() };
  }

  /**
   * Resets the form to initial state
   */
  reset(): void {
    this.formData.set({
      subject: '',
      description: '',
    });
    this.history.set([]);
  }

  /**
   * Gets the number of AI changes in history
   */
  getAIChangeCount(): number {
    return this.history().filter((change) => change.source === 'ai').length;
  }

  /**
   * Finds the index of the last AI change in history
   */
  private findLastAIChangeIndex(hist: FormFieldChange[]): number {
    for (let i = hist.length - 1; i >= 0; i--) {
      if (hist[i].source === 'ai') {
        return i;
      }
    }
    return -1;
  }
}
