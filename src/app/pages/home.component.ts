import { Component, signal, computed } from '@angular/core';
import { ProfileFormComponent } from '../features/ai-form-completion/components/profile-form/profile-form.component';
import { ComparisonViewComponent } from '../features/ai-loading-states/components/comparison-view/comparison-view.component';
import { ActionHistoryDemoComponent } from '../features/undo-timeline/components/action-history-demo.component';

interface FeatureCard {
  title: string;
  description: string;
  subtext: string;
  icon: string;
  id: string;
  status: 'available' | 'coming-soon';
  principles: string[];
}

@Component({
  selector: 'app-home',
  imports: [ProfileFormComponent, ComparisonViewComponent, ActionHistoryDemoComponent],
  template: `
    <header class="header">
      <h1>{{ pageTitle() }}</h1>
    </header>
    @if (!selectedDemo()) {
      <div class="home-container">
        <div class="desktop-notice">
          <span class="notice-icon">💻</span>
          <span class="notice-text">This demo is optimized for desktop viewing only</span>
        </div>
        <div class="features-grid">
          @for (feature of features; track feature.id) {
            <div class="feature-card" [class.coming-soon]="feature.status === 'coming-soon'">
              <div class="card-icon">{{ feature.icon }}</div>
              <h2 class="card-title">{{ feature.title }}</h2>
              <p class="card-description">{{ feature.description }}</p>
              <p class="card-subtext">{{ feature.subtext }}</p>

              @if (feature.status === 'available') {
                <button (click)="selectDemo(feature.id)" class="card-button">Try Demo →</button>
              } @else {
                <button class="card-button disabled" disabled>Coming Soon</button>
              }
            </div>
          }
        </div>
      </div>
    } @else {
      <div class="demo-wrapper">
        <button (click)="backToHome()" class="back-button">← Back to Home</button>

        @switch (selectedDemo()) {
          @case ('ai-form-completion') {
            <app-profile-form />
          }
          @case ('ai-loading-states') {
            <app-comparison-view />
          }
          @case ('action-history') {
            <app-action-history-demo />
          }
        }
      </div>
    }
  `,
  styles: [
    `
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px 40px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .header h1 {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 700;
        color: white;
        text-align: center;
      }

      .home-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 24px;
      }

      .desktop-notice {
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        color: #78350f;
        padding: 16px 24px;
        border-radius: 12px;
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
      }

      .notice-icon {
        font-size: 1.5rem;
      }

      .notice-text {
        font-size: 1rem;
      }

      .hero {
        text-align: center;
        margin-bottom: 60px;
      }

      .hero-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: white;
        margin-bottom: 16px;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      }

      .hero-subtitle {
        font-size: 1.25rem;
        color: rgba(255, 255, 255, 0.95);
        max-width: 600px;
        margin: 0 auto;
      }

      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 30px;
      }

      .feature-card {
        background: white;
        border-radius: 16px;
        padding: 32px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
      }

      .feature-card:not(.coming-soon):hover {
        transform: translateY(-8px);
        box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
      }

      .feature-card.coming-soon {
        opacity: 0.7;
        background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      }

      .card-icon {
        font-size: 3rem;
        margin-bottom: 16px;
        line-height: 1;
      }

      .card-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 12px;
      }

      .card-description {
        font-size: 1rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 8px;
        line-height: 1.5;
      }

      .card-subtext {
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 24px;
        line-height: 1.5;
        font-style: italic;
        flex-grow: 1;
      }

      .card-button {
        display: inline-block;
        width: 100%;
        padding: 14px 24px;
        margin-top: auto;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-decoration: none;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        font-size: 1rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .card-button:not(.disabled):hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .card-button.disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }

      .demo-wrapper {
        min-height: 100vh;
      }

      .back-button {
        display: inline-block;
        color: white;
        background: rgba(255, 255, 255, 0.2);
        text-decoration: none;
        font-weight: 600;
        margin: 20px 0 20px 20px;
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 1rem;
      }

      .back-button:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateX(-4px);
      }

      @media (max-width: 768px) {
        .features-grid {
          grid-template-columns: 1fr;
        }

        .hero-title {
          font-size: 2rem;
        }

        .hero-subtitle {
          font-size: 1rem;
        }
      }
    `,
  ],
})
export class HomeComponent {
  protected readonly selectedDemo = signal<string | null>(null);

  protected readonly pageTitle = computed(() => {
    const demoId = this.selectedDemo();
    if (!demoId) return '🤖 AI Fundamentals for UX';

    const feature = this.features.find((f) => f.id === demoId);
    return feature ? `🤖 ${feature.title}` : '🤖 AI Fundamentals for UX';
  });

  protected readonly features: FeatureCard[] = [
    {
      title: 'AI-assisted Form Completion',
      description: 'AI suggestions with full user control.',
      subtext: 'Explore how AI can assist without taking over decisions.',
      icon: '✨',
      id: 'ai-form-completion',
      status: 'available',
      principles: ['User Agency', 'Transparency', 'Mental Models', 'Feedback Loops'],
    },
    {
      title: 'Transparent Loading States',
      description: 'Making AI processes visible during loading.',
      subtext: 'Compare classic spinners with transparent AI progress.',
      icon: '⏳',
      id: 'ai-loading-states',
      status: 'available',
      principles: ['Transparency', 'Mental Models', 'Trust Building', 'Feedback Loops'],
    },
    {
      title: 'AI Action History + Selective Undo',
      description: 'Safety nets for AI-powered interactions.',
      subtext: 'Track, review, and undo AI actions step by step.',
      icon: '📋',
      id: 'action-history',
      status: 'available',
      principles: ['Safety Nets', 'User Agency', 'Transparency', 'Trust Building'],
    },
  ];

  selectDemo(demoId: string): void {
    this.selectedDemo.set(demoId);
  }

  backToHome(): void {
    this.selectedDemo.set(null);
  }
}
