## Language

- Use only English in all code, including comments, variable names, function names, contents and documentation.
- Always replace any non-English text with English equivalents.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
- `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Project Structure

This is an interactive demonstration platform for "AI Fundamentals for UX" course.

### Hierarchy

- **Course** → **Chapters** → **Subchapters** → **Examples** (Wrong/Right pairs)

### Folder Structure

```
components/
└── [chapter-id]/
    └── [subchapter-id]/
        ├── [example]-wrong/
        └── [example]-right/
```

### Adding New Content

**New Example:**

1. Create `[name]-wrong/` and `[name]-right/` folders
2. Implement both component versions
3. Update `src/app/config/course.config.ts`:
   - Import both components
   - Add to subchapter's examples array

**New Subchapter:**

1. Create folder under chapter: `[chapter]/[subchapter]/`
2. Add example components
3. Update `course.config.ts`: add to chapter's subchapters array

**New Chapter:**

1. Create folder: `components/[chapter-id]/`
2. Add subchapters and examples
3. Update `course.config.ts`: add to chapters array

### Naming Conventions

- Folders & IDs: kebab-case (`human-centered-ai`)
- Classes: PascalCase (`MindsetWrongComponent`)
- Titles: Title Case ("Human-Centered AI")

### Current Structure

- Chapter: "AI & UX Foundations"
- Subchapter: "Human-Centered AI Principles"
- Examples: mindset, recruitment, support

See PROJECT_STRUCTURE.md for detailed documentation.
