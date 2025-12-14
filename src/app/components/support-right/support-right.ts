import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Message {
  id: number;
  sender: 'user' | 'ai' | 'human';
  text: string;
  timestamp: Date;
  handoffReason?: string;
}

interface SupportCase {
  id: number;
  issue: string;
  handler: 'ai' | 'human';
  escalated: boolean;
  complexity: 'simple' | 'moderate' | 'complex';
  resolved: boolean;
}

@Component({
  selector: 'app-support-right',
  imports: [FormsModule],
  templateUrl: './support-right.html',
  styleUrl: './support-right.css',
})
export class SupportRightComponent {
  protected readonly messages = signal<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm here to help with quick questions. For complex issues, I'll connect you with a specialist. How can I assist you?",
      timestamp: new Date(),
    },
  ]);
  protected readonly userInput = signal('');
  protected readonly isTyping = signal(false);
  protected readonly currentHandler = signal<'ai' | 'human'>('ai');
  protected readonly cases = signal<SupportCase[]>([]);
  protected readonly aiSuccessRate = signal(82); // High success rate for simple cases
  protected readonly humanHandoffRate = signal(18);

  private messageId = 2;

  protected readonly quickIssues = [
    'Track my order',
    'Return policy?',
    'Technical issue',
    'Billing problem',
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

    // Smart AI that knows when to escalate
    setTimeout(() => {
      let handler: 'ai' | 'human' = 'ai';
      let response = '';
      let handoffReason = '';
      let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
      let escalated = false;
      let resolved = true;

      if (messageText.toLowerCase().includes('refund')) {
        complexity = 'complex';
        handler = 'human';
        escalated = true;
        handoffReason = 'Refund requests require human verification and empathy';
        response =
          '🔄 Connecting you with a specialist... Your refund request needs personal attention to ensure we understand your situation and process it correctly.';

        // Simulate human takeover after a moment
        setTimeout(() => {
          this.currentHandler.set('human');
          this.messages.update((msgs) => [
            ...msgs,
            {
              id: this.messageId++,
              sender: 'human',
              text: "Hi! I'm Sarah from support. I understand you need a refund. I've reviewed your case - can you tell me more about what went wrong so I can help you properly?",
              timestamp: new Date(),
            },
          ]);
        }, 2000);
      } else if (
        messageText.toLowerCase().includes('track') ||
        messageText.toLowerCase().includes('order')
      ) {
        complexity = 'simple';
        response =
          '📦 I can help with that! Let me check your order status... Your order #12345 is on its way and will arrive tomorrow. Would you like tracking updates via SMS?';
      } else if (
        messageText.toLowerCase().includes('return') ||
        messageText.toLowerCase().includes('policy')
      ) {
        complexity = 'simple';
        response =
          '↩️ Our return policy: You have 30 days for free returns. I can start a return for you - which item would you like to return?';
      } else if (
        messageText.toLowerCase().includes('technical') ||
        messageText.toLowerCase().includes('problem')
      ) {
        complexity = 'moderate';
        handler = 'ai';
        response =
          "🔧 I can help troubleshoot! What specific issue are you experiencing? (If it's complex, I'll connect you with our technical specialist)";
      } else if (messageText.toLowerCase().includes('billing')) {
        complexity = 'complex';
        handler = 'human';
        escalated = true;
        handoffReason = 'Billing issues require careful review and authorization';
        response =
          '💳 Billing matters are important - connecting you with our billing specialist who can review your account securely...';

        setTimeout(() => {
          this.currentHandler.set('human');
          this.messages.update((msgs) => [
            ...msgs,
            {
              id: this.messageId++,
              sender: 'human',
              text: "Hello! I'm Mike from the billing team. I have your account open securely. Let me help you resolve this billing concern.",
              timestamp: new Date(),
            },
          ]);
        }, 2000);
      } else {
        response =
          "I'm here to help! Can you provide more details about your question? I handle simple queries quickly, but for complex matters, I'll connect you with a specialist.";
      }

      this.messages.update((msgs) => [
        ...msgs,
        {
          id: this.messageId++,
          sender: handler === 'human' ? 'ai' : 'ai',
          text: response,
          timestamp: new Date(),
          handoffReason: escalated ? handoffReason : undefined,
        },
      ]);

      // Track case
      this.cases.update((cases) => [
        ...cases,
        {
          id: cases.length + 1,
          issue: messageText.substring(0, 50),
          handler,
          escalated,
          complexity,
          resolved,
        },
      ]);

      this.isTyping.set(false);
    }, 1000);
  }
}
