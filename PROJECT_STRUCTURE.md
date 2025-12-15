# Project Structure Instructions

## Overview
This project is an interactive demonstration platform for the course **"AI Fundamentals for UX"**. It organizes educational content in a hierarchical structure: Chapters → Subchapters → Examples.

## Course Structure

### Current Organization
- **Course**: AI Fundamentals for UX
- **Chapter**: AI & UX Foundations
- **Subchapter**: Human-Centered AI Principles
- **Examples**: Individual demonstrations showing wrong vs. right approaches

## File Organization

### Folder Structure
```
src/app/
├── components/
│   └── [chapter-id]/
│       └── [subchapter-id]/
│           ├── [example-name]-wrong/
│           │   ├── [example-name]-wrong.ts
│           │   ├── [example-name]-wrong.html
│           │   └── [example-name]-wrong.css
│           └── [example-name]-right/
│               ├── [example-name]-right.ts
│               ├── [example-name]-right.html
│               └── [example-name]-right.css
├── models/
│   └── course-structure.ts
└── config/
    └── course.config.ts
```

### Example
```
components/
└── ai-ux-foundations/
    └── human-centered-ai-principles/
        ├── mindset-wrong/
        ├── mindset-right/
        ├── recruitment-wrong/
        └── recruitment-right/
```

## Adding New Content

### 1. Adding a New Example to an Existing Subchapter

**Steps:**
1. Create two component folders under the subchapter directory:
   - `[example-name]-wrong/`
   - `[example-name]-right/`

2. Create the component files in each folder:
   ```typescript
   // [example-name]-wrong.ts
   import { Component } from '@angular/core';
   
   @Component({
     selector: 'app-[example-name]-wrong',
     templateUrl: './[example-name]-wrong.html',
     styleUrl: './[example-name]-wrong.css',
   })
   export class [ExampleName]WrongComponent {
     // Component logic
   }
   ```

3. Update `src/app/config/course.config.ts`:
   ```typescript
   import { [ExampleName]WrongComponent } from '../components/[chapter]/[subchapter]/[example-name]-wrong/[example-name]-wrong';
   import { [ExampleName]RightComponent } from '../components/[chapter]/[subchapter]/[example-name]-right/[example-name]-right';
   
   // Add to the subchapter's examples array:
   {
     id: '[example-id]',
     title: 'Example Title',
     wrongComponent: [ExampleName]WrongComponent,
     rightComponent: [ExampleName]RightComponent,
   }
   ```

### 2. Adding a New Subchapter

**Steps:**
1. Create a new folder under the chapter:
   ```
   components/[chapter-id]/[new-subchapter-id]/
   ```

2. Add example components following the structure above

3. Update `course.config.ts`:
   ```typescript
   // In the chapter's subchapters array:
   {
     id: '[subchapter-id]',
     title: 'Subchapter Title',
     examples: [
       // Add examples here
     ],
   }
   ```

### 3. Adding a New Chapter

**Steps:**
1. Create a new chapter folder:
   ```
   components/[new-chapter-id]/
   ```

2. Create subchapter folders and components inside

3. Update `course.config.ts`:
   ```typescript
   // In the chapters array:
   {
     id: '[chapter-id]',
     title: 'Chapter Title',
     subchapters: [
       // Add subchapters here
     ],
   }
   ```

## Component Guidelines

### Component Pairs (Wrong/Right)
- Each example consists of two components: one showing the wrong approach and one showing the right approach
- Components should be self-contained and demonstrate a specific UX principle
- Use clear visual distinctions and explanatory text

### Naming Conventions
- **Folders**: kebab-case (e.g., `human-centered-ai-principles`)
- **IDs**: kebab-case (e.g., `ai-ux-foundations`)
- **Component Classes**: PascalCase (e.g., `MindsetWrongComponent`)
- **Titles**: Title Case (e.g., "Human-Centered AI Principles")

## UI/UX Patterns

### Accordion Navigation
- Chapters expand to show subchapters
- Subchapters expand to show examples
- Only one chapter and one subchapter should be expanded at a time
- Selected example is highlighted

### Example Display
- Wrong approach: Red label with ❌
- Right approach: Green label with ✅
- Side-by-side comparison on larger screens
- Stacked on mobile devices

## Code Standards

### Language
- **All code, comments, and code content**: English
- **UI text in templates**: English
- **Variable/function names**: English
- **Documentation**: English

### Angular Best Practices
- Use standalone components
- Use signals for state management
- Use `computed()` for derived state
- Use `input()` and `output()` functions
- Set `changeDetection: ChangeDetectionStrategy.OnPush`
- Use native control flow (`@if`, `@for`, `@switch`)
- Use `inject()` function instead of constructor injection

### TypeScript
- Enable strict type checking
- Prefer type inference when obvious
- Avoid `any` type; use `unknown` when uncertain

## Configuration Reference

### course-structure.ts Interface
```typescript
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
```

## Quick Reference

### To Add Content
1. Create component folders in the appropriate location
2. Implement the components
3. Update `course.config.ts` with imports and configuration
4. Test the accordion navigation

### To Modify Structure
1. Update the folder structure
2. Move/rename component folders
3. Update imports in `course.config.ts`
4. Update component selectors if needed

### Common Commands
```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Notes
- The configuration is centralized in `course.config.ts`
- Components are dynamically loaded using `NgComponentOutlet`
- The accordion state is managed with signals
- All content should be easily extensible for future additions
