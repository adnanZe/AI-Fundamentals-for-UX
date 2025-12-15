import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Message {
  id: number;
  sender: 'user' | 'ai' | 'human';
  text: string;
  timestamp: Date;
  confidence?: number;
}

interface SupportCase {
  id: number;
  issue: string;
  aiHandled: boolean;
  escalated: boolean;
  complexity: 'simple' | 'moderate' | 'complex';
}

@Component({
  selector: 'app-support-wrong',
  imports: [FormsModule],
  templateUrl: './support-wrong.html',
  styleUrl: './support-wrong.css',
})
export class SupportWrongComponent {
  protected readonly messages = signal<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am an AI assistant. I will handle ALL your support requests. Please describe your issue.',
      timestamp: new Date(),
    },
  ]);
  protected readonly userInput = signal('');
  protected readonly isTyping = signal(false);
  protected readonly cases = signal<SupportCase[]>([]);
  protected readonly aiSuccessRate = signal(45); // Low success rate

  private messageId = 2;

  protected readonly quickIssues = [
    "My order hasn't arrived",
    'I need a refund',
    'Technical problem with product',
    'Billing issue',
  ];

  protected sendMessage(text?: string): void {
    const messageText = text || this.userInput().trim();
    if (!messageText) return;

    // Add user message
    this.messages.update((msgs) => [
      ...msgs,
      {
        id: this.messageId++,
        sender: 'user',
        text: messageText,
        timestamp: new Date(),
      },
    ]);

    this.userInput.set('');
    this.isTyping.set(true);

    // AI tries to handle everything, even complex cases
    setTimeout(() => {
      let aiResponse = '';
      let aiHandled = true;
      let complexity: 'simple' | 'moderate' | 'complex' = 'simple';

      if (messageText.toLowerCase().includes('refund')) {
        complexity = 'complex';
        aiHandled = false;
        aiResponse =
          'I have processed your refund automatically. You should receive it in 3-5 business days. [AI handled without understanding your specific situation]';
      } else if (
        messageText.toLowerCase().includes('order') ||
        messageText.toLowerCase().includes('arrived')
      ) {
        complexity = 'moderate';
        aiResponse =
          'Your order is in transit. Tracking number: AUTO-GENERATED-123. [AI provides generic response without checking actual status]';
      } else if (
        messageText.toLowerCase().includes('technical') ||
        messageText.toLowerCase().includes('problem')
      ) {
        complexity = 'complex';
        aiHandled = false;
        aiResponse =
          'Have you tried turning it off and on again? Please clear your cache and cookies. [Generic troubleshooting without context]';
      } else if (messageText.toLowerCase().includes('billing')) {
        complexity = 'complex';
        aiHandled = false;
        aiResponse =
          'Your billing information has been updated automatically. [AI makes changes without verification]';
      } else {
        aiResponse =
          'I understand your concern. Please follow these automated steps... [Generic response]';
      }

      this.messages.update((msgs) => [
        ...msgs,
        {
          id: this.messageId++,
          sender: 'ai',
          text: aiResponse,
          timestamp: new Date(),
          confidence: 95, // AI is overconfident
        },
      ]);

      // Track case
      this.cases.update((cases) => [
        ...cases,
        {
          id: cases.length + 1,
          issue: messageText.substring(0, 50),
          aiHandled,
          escalated: false,
          complexity,
        },
      ]);

      this.isTyping.set(false);
    }, 1500);
  }
}
