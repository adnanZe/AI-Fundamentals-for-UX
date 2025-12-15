import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Candidate {
  name: string;
  score: number;
  rejected: boolean;
  reason: string;
  technicalDetails: string;
}

@Component({
  selector: 'app-recruitment-wrong',
  imports: [FormsModule],
  templateUrl: './recruitment-wrong.html',
  styleUrl: './recruitment-wrong.css',
})
export class RecruitmentWrongComponent {
  protected readonly isProcessing = signal(false);
  protected readonly candidates = signal<Candidate[]>([]);
  protected readonly efficencyWeight = signal(80);
  protected readonly diversityWeight = signal(20);
  protected readonly privacyLevel = signal('full-access');

  protected readonly privacyOptions = [
    { value: 'full-access', label: 'Full Data Access (Social Media, etc.)' },
    { value: 'standard', label: 'Standard Data' },
    { value: 'minimal', label: 'Minimal Data' },
  ];

  protected processApplicants(): void {
    this.isProcessing.set(true);

    setTimeout(() => {
      const mockCandidates: Candidate[] = [
        {
          name: 'John Smith',
          score: 95,
          rejected: false,
          reason: 'Perfect match - 5 years at top company',
          technicalDetails: `Efficiency: ${this.efficencyWeight()}%, Privacy: ${this.privacyLevel()}`,
        },
        {
          name: 'Maria Garcia',
          score: 72,
          rejected: true,
          reason: 'Career gap detected: 2 years unemployed',
          technicalDetails: 'Auto-rejected by efficiency filter',
        },
        {
          name: 'Ahmed Hassan',
          score: 68,
          rejected: true,
          reason: 'Postal code outside preferred area',
          technicalDetails: 'Proxy variable filtering applied',
        },
        {
          name: 'Sarah Chen',
          score: 88,
          rejected: false,
          reason: 'Strong technical background',
          technicalDetails: 'Self-taught developer - but matched past patterns',
        },
        {
          name: 'David Kim',
          score: 45,
          rejected: true,
          reason: 'Age over 50 - pattern indicates lower adaptability',
          technicalDetails: 'Historical bias replicated from training data',
        },
      ];

      this.candidates.set(mockCandidates);
      this.isProcessing.set(false);
    }, 1500);
  }
}
