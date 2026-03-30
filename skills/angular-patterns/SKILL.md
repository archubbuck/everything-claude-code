---
name: angular-patterns
description: Angular architecture, component patterns, reactive state with Signals, typed reactive forms, routing, HTTP, and testing for modern Angular (v17+) applications.
origin: ECC
---

# Angular Patterns

Modern Angular patterns for scalable, maintainable applications using standalone components, Signals, and typed reactive forms.

## When to Activate

- Building or reviewing Angular components, services, or directives
- Setting up Angular project architecture or module structure
- Working with reactive state (Signals, RxJS, NgRx)
- Implementing typed reactive forms with validation
- Configuring lazy-loaded routing
- Writing Angular unit tests (Jasmine/Karma) or E2E tests (Playwright)
- Debugging change detection or memory leak issues

## Core Architecture

### Standalone Component with Signals

```typescript
import { Component, ChangeDetectionStrategy, inject, signal, computed, input, output } from '@angular/core'
import { RouterLink } from '@angular/router'
import { toSignal } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Users ({{ total() }})</h2>

    @if (loading()) {
      <p>Loading…</p>
    } @else {
      @for (user of users(); track user.id) {
        <a [routerLink]="['/users', user.id]">{{ user.name }}</a>
      } @empty {
        <p>No users found.</p>
      }
    }
  `
})
export class UserListComponent {
  private userService = inject(UserService)

  users = toSignal(this.userService.getAll(), { initialValue: [] })
  loading = signal(false)
  total = computed(() => this.users().length)

  select = output<string>()
}
```

## Reactive State with Signals

### Component State

```typescript
// PASS: Signals for component-local state
export class CartComponent {
  items = signal<CartItem[]>([])
  total = computed(() => this.items().reduce((sum, i) => sum + i.price, 0))
  isEmpty = computed(() => this.items().length === 0)

  addItem(item: CartItem) {
    this.items.update(current => [...current, item])
  }

  removeItem(id: string) {
    this.items.update(current => current.filter(i => i.id !== id))
  }
}
```

### Service State with Signals

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _theme = signal<'light' | 'dark'>('light')

  theme = this._theme.asReadonly()
  isDark = computed(() => this._theme() === 'dark')

  toggle() {
    this._theme.update(t => t === 'light' ? 'dark' : 'light')
  }
}
```

### RxJS Interop

```typescript
// Convert Observable → Signal
users = toSignal(this.userService.getUsers(), { initialValue: [] })

// Convert Signal → Observable
import { toObservable } from '@angular/core/rxjs-interop'
users$ = toObservable(this.users)
```

## Typed Reactive Forms

```typescript
interface RegistrationForm {
  name: FormControl<string>
  email: FormControl<string>
  password: FormControl<string>
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="name" placeholder="Name" />
      @if (form.controls.name.invalid && form.controls.name.touched) {
        <span class="error">Name is required</span>
      }

      <input formControlName="email" type="email" placeholder="Email" />
      <input formControlName="password" type="password" placeholder="Password" />

      <button type="submit" [disabled]="form.invalid">Register</button>
    </form>
  `
})
export class RegistrationComponent {
  private fb = inject(FormBuilder)

  form = this.fb.group<RegistrationForm>({
    name: this.fb.nonNullable.control('', Validators.required),
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)])
  })

  submit() {
    if (this.form.invalid) return
    const value = this.form.getRawValue() // fully typed: { name: string; email: string; password: string }
    // handle submission
  }
}
```

## Routing

### Route Configuration with Guards and Lazy Loading

```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'users/:id',
    loadComponent: () => import('./users/user-detail.component').then(m => m.UserDetailComponent),
    resolve: { user: userResolver }
  },
  { path: '**', loadComponent: () => import('./not-found.component').then(m => m.NotFoundComponent) }
]
```

### Functional Guard

```typescript
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService)
  const router = inject(Router)
  return auth.isAuthenticated() ? true : router.createUrlTree(['/login'])
}
```

### Functional Resolver

```typescript
export const userResolver: ResolveFn<User> = (route) => {
  return inject(UserService).getById(route.paramMap.get('id')!)
}
```

## HTTP Service Patterns

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient)
  private baseUrl = '/api/users'

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    )
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    )
  }

  create(payload: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.baseUrl, payload).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const message = err.error?.message ?? err.message
    console.error('HTTP error:', message, err)
    return throwError(() => new Error(message))
  }
}
```

## Prevent Memory Leaks

Use `takeUntilDestroyed` from `@angular/core/rxjs-interop` (Angular 16+).

```typescript
// PASS: Automatically unsubscribes on component destroy
@Component({ standalone: true, template: '' })
export class LiveComponent {
  private destroyRef = inject(DestroyRef)

  ngOnInit() {
    someObservable$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(data => { /* handle */ })
  }
}

// FAIL: Manual subscription without cleanup → memory leak
export class BadComponent {
  ngOnInit() {
    someObservable$.subscribe(data => { /* LEAK */ })
  }
}
```

## Anti-Patterns

```typescript
// FAIL: Mutating input signals
@Component({ template: '' })
export class BadComponent {
  items = input<Item[]>([])
  addItem(item: Item) {
    this.items().push(item) // MUTATION — never mutate input values
  }
}

// FAIL: Using async pipe on the same Observable multiple times
// Creates multiple subscriptions
@Component({ template: `
  <p>{{ users$ | async }}</p>
  <p>{{ (users$ | async)?.length }}</p>
` })
export class BadListComponent {
  users$ = this.userService.getAll() // two subscriptions!
}

// PASS: Single subscription via toSignal
@Component({ template: `
  <p>{{ users() }}</p>
  <p>{{ users().length }}</p>
` })
export class GoodListComponent {
  users = toSignal(inject(UserService).getAll(), { initialValue: [] })
}
```

## Testing

### Component Unit Test

```typescript
describe('UserCardComponent', () => {
  let fixture: ComponentFixture<UserCardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(UserCardComponent)
    fixture.componentRef.setInput('user', { id: '1', name: 'Alice', email: 'alice@example.com' })
    fixture.detectChanges()
  })

  it('displays user name', () => {
    const el = fixture.debugElement.query(By.css('[data-testid="name"]'))
    expect(el.nativeElement.textContent).toContain('Alice')
  })

  it('emits select event on click', () => {
    const emitted: string[] = []
    fixture.componentInstance.select.subscribe((id: string) => emitted.push(id))

    fixture.debugElement.query(By.css('button')).nativeElement.click()
    expect(emitted).toEqual(['1'])
  })
})
```

### Service Unit Test

```typescript
describe('UserService', () => {
  let service: UserService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] })
    service = TestBed.inject(UserService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => httpMock.verify())

  it('returns users from API', () => {
    const mock = [{ id: '1', name: 'Alice', email: 'alice@example.com' }]

    service.getAll().subscribe(users => expect(users).toEqual(mock))

    httpMock.expectOne('/api/users').flush(mock)
  })
})
```

## Related Skills

- `frontend-patterns` — React/Next.js patterns (useful for shared UI concepts)
- `coding-standards` — Universal TypeScript/JavaScript standards
- `e2e-testing` — Playwright E2E patterns
- `security-review` — Security checklist (XSS, CSRF, auth)
- `tdd-workflow` — TDD methodology
