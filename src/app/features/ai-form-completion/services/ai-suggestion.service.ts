import { Injectable, signal } from '@angular/core';
import { AISuggestion, ConfidenceLevel } from '../models/ai-suggestion.model';
import { ProfileFormData } from '../models/form-data.model';

@Injectable({
  providedIn: 'root',
})
export class AiSuggestionService {
  private readonly isGenerating = signal(false);

  readonly loading = this.isGenerating.asReadonly();

  /**
   * Generates AI suggestion based on current form field and context
   * Mock implementation for demo purposes
   */
  async generateSuggestion(
    field: keyof ProfileFormData,
    currentValue: string,
    formContext: Partial<ProfileFormData>,
  ): Promise<AISuggestion> {
    this.isGenerating.set(true);

    // Simulate API delay
    await this.delay(1500);

    const suggestion = this.createSuggestion(field, currentValue, formContext);

    this.isGenerating.set(false);
    return suggestion;
  }

  private createSuggestion(
    field: keyof ProfileFormData,
    currentValue: string,
    context: Partial<ProfileFormData>,
  ): AISuggestion {
    switch (field) {
      case 'subject':
        return this.suggestSubject(currentValue, context);
      case 'description':
        return this.suggestDescription(currentValue, context);
      default:
        return this.defaultSuggestion(field, currentValue);
    }
  }

  private suggestSubject(currentValue: string, context: Partial<ProfileFormData>): AISuggestion {
    let suggestedSubject = currentValue.trim();
    let confidence: ConfidenceLevel = 'medium';
    let explanation = 'Improved subject line for clarity.';

    // Detect common issues and categorize
    const lowerValue = currentValue.toLowerCase();

    // Check for vague subjects
    if (
      lowerValue.length < 10 ||
      lowerValue === 'help' ||
      lowerValue === 'problem' ||
      lowerValue === 'issue'
    ) {
      // Try to infer from description if available
      if (context.description) {
        const descLower = context.description.toLowerCase();
        if (descLower.includes('login') || descLower.includes('password')) {
          suggestedSubject = 'Unable to access account';
          confidence = 'high';
          explanation =
            'Detected login issue from description. Subject line clarified for faster support routing.';
        } else if (
          descLower.includes('payment') ||
          descLower.includes('billing') ||
          descLower.includes('charge')
        ) {
          suggestedSubject = 'Billing inquiry - unexpected charge';
          confidence = 'high';
          explanation =
            'Identified billing concern. Clear subject helps route to correct department.';
        } else if (
          descLower.includes('error') ||
          descLower.includes('crash') ||
          descLower.includes('bug')
        ) {
          suggestedSubject = 'Technical error - application malfunction';
          confidence = 'medium';
          explanation = 'Technical issue detected. Descriptive subject aids troubleshooting.';
        } else {
          suggestedSubject =
            currentValue.length > 0 ? `Support needed: ${currentValue}` : 'General support inquiry';
          confidence = 'low';
          explanation =
            'Subject was too vague. Added context, but please refine for better assistance.';
        }
      } else {
        suggestedSubject =
          currentValue.length > 0 ? `Support request: ${currentValue}` : 'General inquiry';
        confidence = 'low';
        explanation = 'Vague subject detected. Consider adding more details about your issue.';
      }
    } else {
      // Improve existing subject
      if (
        lowerValue.includes('cant') ||
        lowerValue.includes('cannot') ||
        lowerValue.includes('wont')
      ) {
        suggestedSubject = currentValue.replace(/cant/gi, 'cannot').replace(/wont/gi, 'will not');
        confidence = 'high';
        explanation = 'Formalized language for professional ticket.';
      } else if (!suggestedSubject.match(/^[A-Z]/)) {
        suggestedSubject = suggestedSubject.charAt(0).toUpperCase() + suggestedSubject.slice(1);
        confidence = 'high';
        explanation = 'Capitalized subject line for proper formatting.';
      }
    }

    return {
      id: this.generateId(),
      field: 'subject',
      suggestedText: suggestedSubject,
      confidence,
      explanation,
      originalText: currentValue,
    };
  }

  private suggestDescription(
    currentValue: string,
    context: Partial<ProfileFormData>,
  ): AISuggestion {
    let suggestedDescription = currentValue.trim();
    let confidence: ConfidenceLevel = 'medium';
    let explanation = 'Enhanced description for better clarity.';

    const lowerValue = currentValue.toLowerCase();

    // Check if description is too short or vague
    if (currentValue.length < 20) {
      confidence = 'low';
      explanation =
        'Description is too brief. Consider adding: When did this start? What error messages do you see? What have you tried?';

      // Try to add helpful prompts based on subject
      if (context.subject) {
        const subjectLower = context.subject.toLowerCase();
        if (subjectLower.includes('login') || subjectLower.includes('access')) {
          suggestedDescription +=
            '\n\nPlease include:\n- What error message appears?\n- When did you last successfully log in?\n- Which browser are you using?';
        } else if (subjectLower.includes('billing') || subjectLower.includes('payment')) {
          suggestedDescription +=
            '\n\nPlease include:\n- Transaction date and amount\n- Last 4 digits of payment method\n- What you expected vs what happened';
        } else {
          suggestedDescription += '\n\nPlease provide more details about the issue.';
        }
      }
    } else {
      // Improve existing description
      let improvements: string[] = [];

      // Check for common issues
      if (!lowerValue.match(/when|started|began|since/)) {
        improvements.push('when the issue started');
      }
      if (
        !lowerValue.match(/error|message|code/) &&
        (lowerValue.includes('crash') || lowerValue.includes('fail'))
      ) {
        improvements.push('any error messages you see');
      }
      if (!lowerValue.match(/tried|attempted|tested/)) {
        improvements.push("what steps you've already tried");
      }

      if (improvements.length > 0) {
        suggestedDescription += `\n\nTo help us assist you faster, please also mention: ${improvements.join(
          ', ',
        )}.`;
        confidence = 'medium';
        explanation = `Added prompts for missing details: ${improvements.join(
          ', ',
        )}. This helps support team resolve your issue faster.`;
      } else {
        // Just formatting improvements
        suggestedDescription = currentValue
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .join('\n\n');
        confidence = 'high';
        explanation =
          'Description looks good! Minor formatting improvements applied for readability.';
      }
    }

    return {
      id: this.generateId(),
      field: 'description',
      suggestedText: suggestedDescription,
      confidence,
      explanation,
      originalText: currentValue,
    };
  }

  private defaultSuggestion(field: string, currentValue: string): AISuggestion {
    return {
      id: this.generateId(),
      field,
      suggestedText: currentValue,
      confidence: 'low',
      explanation: 'No specific suggestion available for this field.',
      originalText: currentValue,
    };
  }

  private calculateConfidence(textLength: number, threshold: number): ConfidenceLevel {
    if (textLength >= threshold * 2) return 'high';
    if (textLength >= threshold) return 'medium';
    return 'low';
  }

  private generateId(): string {
    return `suggestion_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
