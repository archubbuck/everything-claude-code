---
paths:
  - "**/*.component.ts"
  - "**/*.component.html"
  - "**/*.service.ts"
  - "**/*.interceptor.ts"
  - "**/*.guard.ts"
---
# Angular Security

> This file extends [common/security.md](../common/security.md) with Angular specific content.

## Template Security

Angular automatically escapes interpolation (`{{ }}`). Never bypass this with `[innerHTML]` using untrusted data.

```typescript
// NEVER: Bypasses Angular's XSS protection
@Component({ template: `<div [innerHTML]="userContent"></div>` })

// CORRECT: Use interpolation or DomSanitizer when HTML is required
@Component({ template: `<div>{{ userContent }}</div>` })

// CORRECT: When HTML rendering is genuinely needed, sanitize first
export class SafeHtmlComponent {
  private sanitizer = inject(DomSanitizer)
  safeHtml = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.rawHtml()))
}
```

## HTTP Interceptors for Auth

Use functional interceptors (Angular 15+) for attaching auth tokens.

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)
  const token = authService.getToken()

  if (!token) return next(req)

  return next(req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  }))
}
```

## Route Guards

Protect routes with functional guards.

```typescript
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isAuthenticated()) return true

  return router.createUrlTree(['/login'])
}
```

## CSRF Protection

For Angular applications that communicate with a backend:
- Configure `HttpClientXsrfModule` to read and send CSRF tokens automatically
- Validate CSRF tokens server-side on all mutating requests (POST, PUT, DELETE, PATCH)

## Environment Variables

Never hardcode API keys or sensitive configuration in Angular source files.

```typescript
// CORRECT: Use environment files (gitignored for production secrets)
import { environment } from '../environments/environment'

const apiBase = environment.apiUrl

// NEVER: Hardcoded URLs or keys in component/service files
const apiBase = 'https://prod.api.example.com/secret-key'
```

## Agent Support

- Use **security-reviewer** for comprehensive security audits
- Use **angular-reviewer** for Angular-specific security patterns
