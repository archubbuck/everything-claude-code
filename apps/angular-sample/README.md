# Angular Sample App (Standalone)

This is a lightweight example Angular app scaffolded inside `apps/` to illustrate the recommended monorepo layout. It is intentionally minimal and uses standalone components.

## Run locally

```bash
cd apps/angular-sample
npm install
npm run start
```

## What's included
- Minimal `package.json` with Angular 17.2.x dependencies and `@angular/cli` for local dev.
- Standalone `AppComponent` using `bootstrapApplication` in `main.ts`.
- Simple CSS + HTML template to confirm the app boots.

## Notes
- This sample keeps files small to avoid bloating the main plugin repo. For production apps, run `ng add @angular/ssr` or generate full features with `ng g ...` as needed.
- The root ECC config (agents, skills, rules, hooks) automatically applies to files in `apps/angular-sample/src/**/*.ts`.
