import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-right-example',
  imports: [FormsModule],
  templateUrl: './right-example.html',
  styleUrl: './right-example.css',
})
export class RightExampleComponent {
  protected readonly searchQuery = signal('');
  protected readonly isSearching = signal(false);
  protected readonly results = signal<Array<{ title: string; description: string }>>([]);

  protected onSearch(): void {
    if (!this.searchQuery().trim()) return;

    this.isSearching.set(true);

    // Simulate AI-powered search in the background (user doesn't see complexity)
    setTimeout(() => {
      const query = this.searchQuery().toLowerCase();

      // AI intelligently searches clothing based on user intent
      const clothingResults = [
        {
          title: 'Classic Winter Jacket - Waterproof',
          description:
            'Perfect for cold weather. Insulated, windproof design with multiple pockets. €129.99',
        },
        {
          title: 'Lightweight Down Coat',
          description:
            'Stylish and warm. Packable design ideal for travel. Available in 5 colors. €89.99',
        },
        {
          title: 'All-Weather Parka',
          description:
            'Versatile outdoor jacket with removable lining. Water-resistant fabric. €159.99',
        },
      ];

      this.results.set(clothingResults);
      this.isSearching.set(false);
    }, 800);
  }
}
