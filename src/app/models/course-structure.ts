import { Type } from '@angular/core';

export interface ExampleComponent {
  id: string;
  title: string;
  wrongComponent: Type<any>;
  rightComponent: Type<any>;
}

export interface Subchapter {
  id: string;
  title: string;
  examples: ExampleComponent[];
}

export interface Chapter {
  id: string;
  title: string;
  subchapters: Subchapter[];
}

export interface CourseStructure {
  title: string;
  chapters: Chapter[];
}
