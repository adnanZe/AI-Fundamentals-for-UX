import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Candidate {
  name: string;
  score: number;
  status: 'accepted' | 'review' | 'rejected';
  strengths: string[];
  concerns: string[];
  explanation: string;
  humanReviewRequired: boolean;
}

@Component({
  selector: 'app-recruitment-right',
  imports: [FormsModule],
  templateUrl: './recruitment-right.html',
  styleUrl: './recruitment-right.css',
})
export class RecruitmentRightComponent {
  protected readonly isProcessing = signal(false);
  protected readonly candidates = signal<Candidate[]>([]);
  protected readonly showTransparency = signal(true);

  protected processApplicants(): void {
    this.isProcessing.set(true);

    setTimeout(() => {
      const mockCandidates: Candidate[] = [
        {
          name: 'John Smith',
          score: 92,
          status: 'accepted',
          strengths: ['5 years experience', 'Strong technical skills', 'Leadership potential'],
          concerns: [],
          explanation:
            'Excellent match for role requirements. Experience aligns well with team needs.',
          humanReviewRequired: false,
        },
        {
          name: 'Maria Garcia',
          score: 78,
          status: 'review',
          strengths: [
            'Career transition shows adaptability',
            'Strong learning mindset',
            'Unique perspective',
          ],
          concerns: ['2-year career gap needs context'],
          explanation:
            'Promising candidate with career gap. Human review recommended to understand context and assess long-term potential.',
          humanReviewRequired: true,
        },
        {
          name: 'Ahmed Hassan',
          score: 85,
          status: 'accepted',
          strengths: ['Diverse background', 'Problem-solving skills', 'Cultural fit'],
          concerns: [],
          explanation:
            'Strong candidate with valuable diverse perspective. Skills match role requirements.',
          humanReviewRequired: false,
        },
        {
          name: 'Sarah Chen',
          score: 88,
          status: 'accepted',
          strengths: [
            'Self-taught excellence',
            'Portfolio demonstrates capability',
            'Growth mindset',
          ],
          concerns: [],
          explanation:
            'Non-traditional background is a strength. Demonstrated skills through portfolio work.',
          humanReviewRequired: false,
        },
        {
          name: 'David Kim',
          score: 82,
          status: 'review',
          strengths: ['20+ years experience', 'Mentorship capability', 'Industry knowledge'],
          concerns: ['Tech stack refresh may be needed'],
          explanation:
            'Experienced professional who could bring valuable mentorship. Human review to discuss tech stack alignment.',
          humanReviewRequired: true,
        },
      ];

      this.candidates.set(mockCandidates);
      this.isProcessing.set(false);
    }, 1000);
  }
}
