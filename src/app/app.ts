import { Component, signal, computed } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { COURSE_CONFIG } from './config/course.config';
import { Chapter, Subchapter, ExampleComponent } from './models/course-structure';

@Component({
  selector: 'app-root',
  imports: [NgComponentOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly courseConfig = COURSE_CONFIG;
  protected readonly expandedChapterId = signal<string | null>(null);
  protected readonly expandedSubchapterId = signal<string | null>(null);
  protected readonly selectedExample = signal<ExampleComponent | null>(null);

  protected readonly currentChapter = computed(() => {
    const chapterId = this.expandedChapterId();
    return chapterId ? this.courseConfig.chapters.find((ch) => ch.id === chapterId) ?? null : null;
  });

  protected readonly currentSubchapter = computed(() => {
    const subchapterId = this.expandedSubchapterId();
    const chapter = this.currentChapter();
    return chapter && subchapterId
      ? chapter.subchapters.find((sub) => sub.id === subchapterId) ?? null
      : null;
  });

  protected toggleChapter(chapterId: string): void {
    if (this.expandedChapterId() === chapterId) {
      this.expandedChapterId.set(null);
      this.expandedSubchapterId.set(null);
      this.selectedExample.set(null);
    } else {
      this.expandedChapterId.set(chapterId);
      this.expandedSubchapterId.set(null);
      this.selectedExample.set(null);
    }
  }

  protected toggleSubchapter(subchapterId: string): void {
    if (this.expandedSubchapterId() === subchapterId) {
      this.expandedSubchapterId.set(null);
      this.selectedExample.set(null);
    } else {
      this.expandedSubchapterId.set(subchapterId);
      this.selectedExample.set(null);
    }
  }

  protected selectExample(example: ExampleComponent): void {
    this.selectedExample.set(example);
  }

  protected isChapterExpanded(chapterId: string): boolean {
    return this.expandedChapterId() === chapterId;
  }

  protected isSubchapterExpanded(subchapterId: string): boolean {
    return this.expandedSubchapterId() === subchapterId;
  }

  protected isExampleSelected(exampleId: string): boolean {
    return this.selectedExample()?.id === exampleId;
  }
}
