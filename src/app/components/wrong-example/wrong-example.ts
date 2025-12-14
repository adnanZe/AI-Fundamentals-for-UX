import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wrong-example',
  imports: [FormsModule],
  templateUrl: './wrong-example.html',
  styleUrl: './wrong-example.css',
})
export class WrongExampleComponent {
  protected readonly searchQuery = signal('');
  protected readonly selectedAiModel = signal('gpt-4');
  protected readonly temperature = signal(0.7);
  protected readonly maxTokens = signal(1000);
  protected readonly topP = signal(0.9);
  protected readonly frequencyPenalty = signal(0.0);
  protected readonly presencePenalty = signal(0.0);
  protected readonly isSearching = signal(false);
  protected readonly results = signal<string[]>([]);

  protected readonly aiModels = ['gpt-4', 'gpt-3.5-turbo', 'claude-3', 'palm-2', 'llama-2'];

  protected onSearch(): void {
    if (!this.searchQuery().trim()) return;

    this.isSearching.set(true);

    // Simulate complex AI configuration process
    setTimeout(() => {
      this.results.set([
        `Winter Jacket - ${this.selectedAiModel()} (confidence: ${(this.temperature() * 50).toFixed(
          0
        )}%)`,
        `Summer T-Shirt - processed with ${this.maxTokens()} tokens`,
        `Running Shoes - filtered by penalty: ${this.frequencyPenalty()}`,
      ]);
      this.isSearching.set(false);
    }, 1500);
  }
}
