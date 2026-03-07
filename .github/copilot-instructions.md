# Inovare Frontend - Copilot Instructions

This is a **Nuxt 4** application for managing bridal lingerie shower events (chás de lingerie). The application connects to a backend API and provides role-based interfaces for brides/hosts and administrators.

## Build, Test, and Lint

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build locally
npx eslint .         # Lint with ESLint (@nuxt/eslint module)
```

No tests currently configured. `@nuxt/test-utils` is installed if tests are added.

## Architecture

### Role-Based Access
- **BRIDE (role: 1)**: Creates and manages their own showers, sets preferences, reviews catalogs
- **ADMIN (role: 2)**: Manages all showers, creates product catalogs for brides

### Authentication Flow
1. `POST /api/login` — returns JWT token + user object
2. Token saved to cookie `auth-token` (7-day maxAge, lax SameSite); user saved to `localStorage` as `auth-user`
3. `plugins/auth.client.ts` calls `checkAuth()` on mount to restore session
4. `app.vue` waits for `authInitialized` before rendering (prevents flash)
5. JWT `exp` claim decoded client-side to detect expiry
6. Three middleware layers protect routes:
   - `auth.global.ts` — runs on every route (client-side only); redirects unauthenticated → `/login`
   - `user.ts` — BRIDE role only; redirects admins → `/admin`
   - `admin.ts` — ADMIN role only; redirects non-admins → `/`

### Shower Workflow (Status Progression)
1. **DRAFT** → Bride creates shower
2. **PREFERENCES_SET** → Bride sets preferences
3. **CATALOG_IN_PROGRESS** → Admin begins catalog
4. **CATALOG_READY** → Admin completes catalog, awaiting bride approval
5. **APPROVED** → Bride approves catalog
6. **COMPLETED** → Event completed

### Key Files and Patterns

#### Composables
- `useApi()` — wraps `$fetch` with `Authorization: Bearer <token>` header; base URL from `runtimeConfig.public.apiBase`; logs all requests/responses
- `useAuth()` — reactive auth state via Nuxt `useState`; exposes `isAuthenticated`, `isAdmin`, `isBride`; handles login/logout/checkAuth
- `useDate()` — `formatDate(str)` → "dd/mm/yyyy", `formatDateTime(str)` → "dd/mm/yyyy HH:mm"; handles backend microsecond timestamps

#### Type System
All types defined in `app/types/index.ts`:
- **Interfaces:** `User`, `AuthState`, `LoginCredentials`, `LoginResponse`, `Shower`, `ShowerPreferences`, `Catalog`, `Product`, `Review`, `ApiResponse<T>`
- **Enums:** `UserRole` (BRIDE=1, ADMIN=2), `ShowerStatus`, `CatalogStatus`

#### Layouts
- `default.vue` — minimal public pages
- `auth.vue` — login/signup (no nav)
- `authenticated.vue` — header with logo, username, logout + footer
- `admin.vue` — header with nav links (Dashboard, Chás, Lingerie) + footer

#### Route Protection
```typescript
definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'admin'
})
```

#### Components
- `DatePicker.vue` — `UInputDate` + `UCalendar` wrapper (locale: en-GB)
- `RecentShowerCard.vue` — shower summary card linking to `/admin/showers/[id]`

## Configuration

### Environment Variables
```
NUXT_PUBLIC_API_BASE=http://localhost:8080
```

### Nuxt Config
- `ssr: true` — but all auth logic uses `import.meta.client`
- `ui.colorMode: false` — dark mode disabled
- Runtime config exposes `apiBase` to client via `public.apiBase`

### Color Theme
- Primary: custom `brand` palette (brownish, ~`#a66155`) — set via `--ui-primary`
- Secondary: custom `rose` palette (~`#dfb3a4`) — set via `--ui-secondary`
- Defined in `assets/css/main.css` and `app.config.ts`

## Conventions

### Component Library
Uses **@nuxt/ui** (TailwindCSS-based):
- `UButton`, `UCard`, `UInput`, `UBadge`, `UAlert`, `UForm`, `UFormField`, `UApp`
- Iconify icons via `@iconify-json/heroicons`: `i-heroicons-xxx`
- Toast notifications via `useToast()`
- For color chip displays, use `UBadge variant="outline"` with inline `borderColor` and `color` styles driven by a hex lookup (not `backgroundColor`)

### Images
- Always use `object-contain` on `<img>` tags to show the full image without cropping
- Only use `object-cover` when intentional cropping is explicitly required by design

### Localization
- Portuguese (pt-BR) is the primary language for all UI labels and content
- Dates formatted via `useDate()` composable

### Status Mapping
Map enum values to Portuguese labels:
```typescript
{
  [ShowerStatus.DRAFT]: 'Rascunho',
  [ShowerStatus.PREFERENCES_SET]: 'Preferências Definidas',
  [ShowerStatus.CATALOG_IN_PROGRESS]: 'Catálogo em Andamento',
  [ShowerStatus.CATALOG_READY]: 'Catálogo Pronto',
  [ShowerStatus.APPROVED]: 'Aprovado',
  [ShowerStatus.COMPLETED]: 'Concluído',
}
```

### Multi-Step Signup
- Step tracked in `sessionStorage['signup-current-step']`
- `auth.global.ts` allows `/signup` if this key is set (prevents redirect mid-flow)

### Deployment
- Firebase hosting (`firebase.json`, `.firebaserc`)

