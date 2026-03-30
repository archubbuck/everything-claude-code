---
paths:
  - "**/*.component.ts"
  - "**/*.service.ts"
  - "**/*.directive.ts"
  - "**/*.pipe.ts"
---
# Angular Hooks

> This file extends [common/hooks.md](../common/hooks.md) with Angular lifecycle hook content.

## Lifecycle Hooks

Use Angular lifecycle hooks to manage initialization, change detection, and cleanup.

### Initialization

```typescript
@Component({ standalone: true, template: '' })
export class UserComponent implements OnInit {
  private userService = inject(UserService)
  user = signal<User | null>(null)

  ngOnInit() {
    // Side effects that depend on injected services go here
    this.userService.getCurrent().subscribe(u => this.user.set(u))
  }
}
```

### Cleanup (Prevent Memory Leaks)

Always unsubscribe from Observables in `ngOnDestroy`, or use `takeUntilDestroyed`.

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({ standalone: true, template: '' })
export class LiveFeedComponent {
  private feedService = inject(FeedService)

  // takeUntilDestroyed automatically unsubscribes when the component is destroyed
  feed = toSignal(
    this.feedService.live$.pipe(takeUntilDestroyed()),
    { initialValue: [] }
  )
}
```

### Change Detection

```typescript
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class PureComponent implements OnChanges {
  data = input.required<Data>()

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      // React to input changes
    }
  }
}
```

## Service Lifecycle

Services provided at root level (`providedIn: 'root'`) are singletons. Prefer this over module-scoped providers for shared state.

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  // Singleton — shared application-wide
}
```

## Agent Support

- **angular-reviewer** — Reviews lifecycle hook usage and cleanup correctness
