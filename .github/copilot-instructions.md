# GitHub Copilot Instructions

This repository is **Everything Claude Code (ECC)** — a production-ready AI coding plugin providing specialized agents, skills, hooks, commands, rules, and MCP configurations for software development.

## Project Structure

- `agents/` — Specialized subagents for delegation (e.g., `angular-reviewer`, `typescript-reviewer`)
- `skills/` — Workflow skill definitions (`skills/<name>/SKILL.md`)
- `commands/` — Slash commands invoked by users (`/tdd`, `/plan`, `/e2e`)
- `hooks/` — Trigger-based automations
- `rules/` — Language-specific coding rules (`rules/<language>/*.md`)
- `mcp-configs/` — MCP server configurations
- `apps/` — Your applications (e.g., Angular frontends, APIs) when you sideload ECC into a repo; keep ECC at repo root and place app projects under `apps/`

## Coding Standards

Follow the conventions in `rules/common/` and language-specific rules in `rules/<language>/`:

- **Immutability**: Always create new objects/arrays — never mutate in place
- **Error handling**: Use `try/catch`, narrow `unknown` errors, never swallow errors silently
- **TypeScript**: Strict mode, no `any`, explicit return types on public APIs
- **Angular**: Use standalone components, typed reactive forms, `inject()` function, `OnPush` change detection
- **Testing**: TDD workflow, 80%+ coverage, Jasmine/Karma for Angular unit tests, Playwright for E2E

## Commit Format (Conventional Commits)

```
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`, `perf`

Examples:
- `feat(rules): add Angular language rules`
- `fix(angular): correct template binding syntax`
- `docs(skills): update angular-patterns SKILL.md`

## Angular Development Conventions

When working on Angular code:

1. **Standalone components** — use `standalone: true`, avoid `NgModule` for new code
2. **Signals** — prefer Angular Signals over `BehaviorSubject` for reactive state
3. **`inject()` function** — use instead of constructor injection for new components
4. **Typed forms** — use `FormBuilder` with explicit generic types
5. **Change detection** — default to `ChangeDetectionStrategy.OnPush`
6. **Lazy loading** — use `loadComponent` / `loadChildren` for route-level code splitting
7. **HTTP** — use `HttpClient` with typed responses; handle errors with `catchError`

## Agents to Delegate To

When working on this codebase, prefer delegating complex tasks to the specialized agents:

| Task | Agent |
|------|-------|
| Angular code review | `angular-reviewer` |
| TypeScript/JS review | `typescript-reviewer` |
| Security audit | `security-reviewer` |
| TDD guidance | `tdd-guide` |
| Build errors | `build-error-resolver` |
| E2E tests | `e2e-runner` |

## File Naming

- Agent files: `agents/<name>.md` (kebab-case)
- Skill files: `skills/<name>/SKILL.md` (kebab-case directory)
- Rule files: `rules/<language>/<topic>.md`
- Test files: `*.test.js` (in `tests/`)

## Security Checklist

Before every commit:
- No hardcoded secrets or API keys
- All user inputs validated
- No `eval` or `new Function` with untrusted input
- No `innerHTML` with unsanitized user data (use Angular's `DomSanitizer` or `[innerText]`)
- Environment variables used for configuration

## Related Skills

- `angular-patterns` — Angular architecture, component patterns, reactive state
- `frontend-patterns` — React/Next.js patterns (applicable for shared UI concepts)
- `coding-standards` — Universal TypeScript/JavaScript standards
- `e2e-testing` — Playwright E2E patterns
- `security-review` — Security checklist and patterns
