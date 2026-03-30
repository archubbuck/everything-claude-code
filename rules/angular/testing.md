---
paths:
  - "**/*.spec.ts"
  - "**/*.component.ts"
  - "**/*.service.ts"
  - "**/*.pipe.ts"
  - "**/*.directive.ts"
---
# Angular Testing

> This file extends [common/testing.md](../common/testing.md) with Angular specific content.

## Unit Testing (Jasmine / Karma)

Use `TestBed` for Angular-aware component and service tests.

### Component Test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

describe('UserCardComponent', () => {
  let fixture: ComponentFixture<UserCardComponent>
  let component: UserCardComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent]  // standalone component
    }).compileComponents()

    fixture = TestBed.createComponent(UserCardComponent)
    component = fixture.componentInstance
  })

  it('displays the user name', () => {
    fixture.componentRef.setInput('user', { id: '1', name: 'Alice' })
    fixture.detectChanges()

    const heading = fixture.debugElement.query(By.css('h2'))
    expect(heading.nativeElement.textContent).toContain('Alice')
  })
})
```

### Service Test

```typescript
import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'

describe('UserService', () => {
  let service: UserService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
    service = TestBed.inject(UserService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => httpMock.verify())

  it('fetches users from the API', () => {
    const mockUsers: User[] = [{ id: '1', name: 'Alice' }]

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers)
    })

    const req = httpMock.expectOne('/api/users')
    expect(req.request.method).toBe('GET')
    req.flush(mockUsers)
  })
})
```

## E2E Testing (Playwright)

Use **Playwright** for critical Angular user flows.

```typescript
import { test, expect } from '@playwright/test'

test('user can log in and see dashboard', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[data-testid="email"]', 'user@example.com')
  await page.fill('[data-testid="password"]', 'password123')
  await page.click('[data-testid="submit"]')

  await expect(page).toHaveURL('/dashboard')
  await expect(page.locator('h1')).toHaveText('Dashboard')
})
```

## Agent Support

- **e2e-runner** — Playwright E2E testing specialist
- **angular-reviewer** — Angular code review including test quality
