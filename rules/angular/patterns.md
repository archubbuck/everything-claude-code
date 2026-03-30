---
paths:
  - "**/*.component.ts"
  - "**/*.component.html"
  - "**/*.service.ts"
  - "**/*.pipe.ts"
  - "**/*.directive.ts"
  - "**/*.guard.ts"
  - "**/*.resolver.ts"
  - "**/*.interceptor.ts"
  - "**/*.module.ts"
  - "angular.json"
---
# Angular Patterns

> This file extends [common/patterns.md](../common/patterns.md) with Angular specific content.

## Smart / Presentational Component Split

Keep data-fetching logic in "smart" containers and keep UI logic in pure "presentational" components.

```typescript
// Smart (container) — fetches data, manages state
@Component({
  standalone: true,
  imports: [UserListComponent],
  template: `<app-user-list [users]="users()" (select)="onSelect($event)" />`
})
export class UserPageComponent {
  private userService = inject(UserService)
  users = toSignal(this.userService.getAll(), { initialValue: [] })

  onSelect(id: string) { inject(Router).navigate(['/users', id]) }
}

// Presentational — receives data via inputs, emits events via outputs
@Component({
  standalone: true,
  selector: 'app-user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (user of users(); track user.id) {
      <button (click)="select.emit(user.id)">{{ user.name }}</button>
    }
  `
})
export class UserListComponent {
  users = input.required<User[]>()
  select = output<string>()
}
```

## Typed Reactive Forms

Always use typed `FormGroup` and `FormControl` for compile-time safety.

```typescript
interface LoginForm {
  email: FormControl<string>
  password: FormControl<string>
}

@Component({ standalone: true, imports: [ReactiveFormsModule] })
export class LoginComponent {
  private fb = inject(FormBuilder)

  form = this.fb.group<LoginForm>({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)])
  })

  submit() {
    if (this.form.invalid) return
    const { email, password } = this.form.getRawValue()
    // type-safe: email and password are string, not string | null
  }
}
```

## Route-Level Code Splitting

Use `loadComponent` and `loadChildren` for lazy-loaded routes.

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  }
]
```

## HTTP with Error Handling

Use `HttpClient` with typed responses and `catchError`.

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient)

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Failed to fetch users', err)
        return throwError(() => new Error('Could not load users'))
      })
    )
  }
}
```

## Custom Directive Pattern

```typescript
@Directive({
  selector: '[appAutoFocus]',
  standalone: true
})
export class AutoFocusDirective implements AfterViewInit {
  private el = inject(ElementRef<HTMLElement>)

  ngAfterViewInit() {
    this.el.nativeElement.focus()
  }
}
```

## Reference

See skill: `angular-patterns` for complete architecture patterns, RxJS operators, NgRx state management, and testing strategies.
