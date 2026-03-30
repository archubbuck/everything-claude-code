---
paths:
  - "**/*.component.ts"
  - "**/*.component.html"
  - "**/*.component.scss"
  - "**/*.component.css"
  - "**/*.service.ts"
  - "**/*.pipe.ts"
  - "**/*.directive.ts"
  - "**/*.guard.ts"
  - "**/*.resolver.ts"
  - "**/*.interceptor.ts"
  - "**/*.module.ts"
  - "angular.json"
---
# Angular Coding Style

> This file extends [common/coding-style.md](../common/coding-style.md) with Angular specific content.

## Component Architecture

### Standalone Components (Preferred)

Use `standalone: true` for all new components. Avoid `NgModule` for new code.

```typescript
// CORRECT: Standalone component
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="user-card">
      <h2>{{ user().name }}</h2>
      <a [routerLink]="['/users', user().id]">View Profile</a>
    </div>
  `
})
export class UserCardComponent {
  user = input.required<User>()
}
```

### Change Detection

Default to `OnPush` for all components. This requires reactive data flow (Signals or Observables).

```typescript
// CORRECT: OnPush with Signals
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>{{ count() }}</p>`
})
export class CounterComponent {
  count = signal(0)
  increment() { this.count.update(n => n + 1) }
}
```

## Dependency Injection

### `inject()` Function (Preferred)

Use the `inject()` function instead of constructor injection for new components and services.

```typescript
// CORRECT: inject() function
@Component({ standalone: true, template: '' })
export class UserListComponent {
  private userService = inject(UserService)
  private router = inject(Router)

  users = toSignal(this.userService.getUsers(), { initialValue: [] })
}

// AVOID: Constructor injection for new code
export class UserListComponent {
  constructor(private userService: UserService) {}
}
```

## Reactive State with Signals

Prefer Angular Signals over `BehaviorSubject` for component state.

```typescript
// CORRECT: Signals
export class CartComponent {
  private cartService = inject(CartService)

  items = toSignal(this.cartService.items$, { initialValue: [] })
  total = computed(() => this.items().reduce((sum, i) => sum + i.price, 0))
  isEmpty = computed(() => this.items().length === 0)
}

// AVOID: BehaviorSubject in components
export class CartComponent {
  items$ = new BehaviorSubject<CartItem[]>([])
}
```

## Template Syntax

- Use `@if`, `@for`, `@switch` (Angular 17+ control flow) instead of `*ngIf`, `*ngFor`
- Bind to `[innerText]` or use `{{ }}` interpolation — never `[innerHTML]` with untrusted input
- Use `(click)` and event bindings rather than direct DOM manipulation

```html
<!-- CORRECT: New control flow syntax -->
@if (user(); as u) {
  <div>{{ u.name }}</div>
} @else {
  <p>No user found</p>
}

@for (item of items(); track item.id) {
  <app-item [item]="item" />
}
```

## Naming Conventions

| Element | Suffix | Example |
|---------|--------|---------|
| Component | `.component.ts` | `user-card.component.ts` |
| Service | `.service.ts` | `user.service.ts` |
| Directive | `.directive.ts` | `highlight.directive.ts` |
| Pipe | `.pipe.ts` | `currency-format.pipe.ts` |
| Guard | `.guard.ts` | `auth.guard.ts` |
| Interceptor | `.interceptor.ts` | `auth.interceptor.ts` |
| Model/Interface | `.model.ts` | `user.model.ts` |
| Spec | `.spec.ts` | `user.service.spec.ts` |

## Reference

See skill: `angular-patterns` for comprehensive Angular architecture, routing, forms, and RxJS patterns.
