# AGENTS.md - Inovare Frontend

## Overview
Nuxt 4 application for managing bridal lingerie shower events (chás de lingerie). Uses Vue 3, TypeScript, @nuxt/ui (TailwindCSS), and connects to a backend API.

---

## Build, Test, and Lint Commands

### Development
```bash
npm run dev              # Start dev server on http://localhost:3000
npm run postinstall      # Run nuxt prepare (auto-runs after npm install)
```

### Build & Preview
```bash
npm run build            # Build for production
npm run preview          # Preview production build locally
npm run generate         # Generate static site
```

### Linting
```bash
npx eslint .             # Run ESLint on entire project
```

### Testing
**No tests currently configured.** If adding tests, use `@nuxt/test-utils` (already installed).

---

## Directory Structure

```
app/
├── app.vue                      # Root component — waits for authInitialized before rendering
├── assets/css/main.css          # Tailwind + custom brand/rose color theme
├── components/
│   ├── DatePicker.vue           # UInputDate + UCalendar wrapper (locale: en-GB)
│   └── RecentShowerCard.vue     # Shower summary card, links to /admin/showers/[id]
├── composables/
│   ├── useApi.ts                # $fetch wrapper with auth headers + request logging
│   ├── useAuth.ts               # JWT auth state management (cookie + localStorage)
│   └── useDate.ts               # Date parsing and pt-BR formatting
├── layouts/
│   ├── default.vue              # Minimal light background (public pages)
│   ├── auth.vue                 # No nav (login/signup)
│   ├── authenticated.vue        # Header with logo, username, logout + footer
│   └── admin.vue                # Header with nav (Dashboard, Chás, Lingerie) + footer
├── middleware/
│   ├── auth.global.ts           # Global: redirects unauthenticated users to /login
│   ├── user.ts                  # BRIDE role guard, redirects admins to /admin
│   └── admin.ts                 # ADMIN role guard, redirects non-admins to /
├── pages/
│   ├── index.vue                # Bride dashboard: shower list with preferences/catalog info
│   ├── login.vue                # Login form
│   ├── signup.vue               # Multi-step registration
│   ├── shower/
│   │   ├── create.vue           # Create new shower
│   │   └── [id]/
│   │       ├── preferences.vue  # Set shower preferences
│   │       └── catalog.vue      # View approved catalog
│   └── admin/
│       ├── index.vue            # Admin dashboard
│       ├── showers.vue          # Shower list
│       ├── products.vue         # Product CRUD
│       └── showers/[id]/
│           ├── index.vue        # Shower detail/edit
│           └── catalog/create.vue # Create/edit catalog
├── plugins/
│   └── auth.client.ts           # Calls checkAuth() on client mount to restore session
└── types/index.ts               # All TypeScript types and enums
```

---

## Pages & Routes

| Route | Middleware | Layout | Purpose |
|-------|-----------|--------|---------|
| `/login` | — | `auth` | Login form |
| `/signup` | — | `auth` | Multi-step registration |
| `/` | `auth.global`, `user` | `authenticated` | Bride shower dashboard |
| `/shower/create` | `user` | `authenticated` | Create new shower |
| `/shower/[id]/preferences` | `user` | `authenticated` | Set shower preferences |
| `/shower/[id]/catalog` | `user` | `authenticated` | View catalog |
| `/admin` | `admin` | `admin` | Admin dashboard |
| `/admin/showers` | `admin` | `admin` | All showers list |
| `/admin/showers/[id]` | `admin` | `admin` | Shower detail/edit |
| `/admin/showers/[id]/catalog/create` | `admin` | `admin` | Create/edit catalog |
| `/admin/products` | `admin` | `admin` | Product CRUD |

---

## Code Style Guidelines

### TypeScript
- All types/enums defined in `app/types/index.ts`
- Use interfaces for objects, enums for constants
- Prefer explicit return types for composables
- Use `any` sparingly; prefer `unknown` when type is unknown

### Vue/Nuxt Patterns

**Composables (`app/composables/`):**
- Use `useXxx` naming (e.g., `useAuth`, `useApi`)
- Use Nuxt's `useState` for reactive state
- Return typed objects with computed properties
- Use `useRuntimeConfig()` for configuration access

**Components (`app/components/`):**
- Use `<script setup lang="ts">` syntax
- Define props with `defineProps<{...}>()` and type definitions
- Use `computed` for derived state
- Components are auto-imported; no explicit imports needed

**Pages (`app/pages/`):**
- Use `definePageMeta()` for route configuration (middleware + layout)
- Use `navigateTo()` for programmatic routing
- Use `import.meta.client` for browser-only code to prevent SSR issues

**Middleware (`app/middleware/`):**
- `auth.global.ts` — runs on every route (client-side only)
- `user.ts` — BRIDE role only
- `admin.ts` — ADMIN role only
- Chain middleware: `definePageMeta({ middleware: ['auth', 'admin'] })`

### Component Library (@nuxt/ui)
- Primary components: `UButton`, `UCard`, `UInput`, `UBadge`, `UAlert`, `UForm`, `UFormField`
- Use `ClientOnly` wrapper for client-side only components
- Icons via Heroicons: `i-heroicons-xxx`
- TailwindCSS utility classes for styling
- For color chip displays, use `UBadge variant="outline"` with inline `borderColor` and `color` styles driven by a hex lookup (not `backgroundColor`)
- Toast notifications via `useToast()`

### Images
- Always use `object-contain` on `<img>` tags to show the full image without cropping
- Only use `object-cover` when intentional cropping is required by design

### File Naming Conventions
- **Components:** PascalCase (e.g., `RecentShowerCard.vue`)
- **Composables:** camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Types:** PascalCase (e.g., `UserRole`)
- **Pages:** kebab-case with route params (e.g., `[id]/catalog.vue`)

### Imports Organization
```typescript
// 1. Vue/Nuxt imports
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 2. Type imports (use ~ alias)
import type { User, Shower } from '~/types'
import { UserRole } from '~/types'

// 3. Composable imports (usually auto-imported, add only if needed)
import { useAuth } from '~/composables/useAuth'
```

### Error Handling
- Use try/catch in async functions
- Display errors to users via `UAlert` component
- Toast notifications via `useToast()` for transient feedback
- Log errors to console for debugging

### API Calls
- Use `useApi()` composable for authenticated requests — automatically includes `Authorization: Bearer <token>` header
- Base URL from `runtimeConfig.public.apiBase`
- Always handle errors and show user feedback
- Requests and responses are logged to console by `useApi` automatically
- Some pages use direct `fetch()` (e.g., `login.vue`) — prefer `useApi` for new code

### Date Formatting
- Use `useDate()` composable: `formatDate(str)` → "dd/mm/yyyy", `formatDateTime(str)` → "dd/mm/yyyy HH:mm"
- Handles backend microsecond timestamps via `parseBackendDate()`
- Locale: `pt-BR`

---

## Architecture

### Role-Based Access
- **BRIDE (role: 1):** Creates/manages own showers, sets preferences, reviews catalogs
- **ADMIN (role: 2):** Manages all showers, creates product catalogs

### Authentication Flow
1. `POST /api/login` with email + password
2. JWT token saved to cookie `auth-token` (7-day maxAge, lax SameSite); user object saved to `localStorage` as `auth-user`
3. `plugins/auth.client.ts` calls `checkAuth()` on mount to restore session from storage
4. `app.vue` waits for `authInitialized` before rendering to prevent flash
5. `auth.global.ts` runs on every route: redirects unauthenticated users to `/login`, authenticated users away from `/login`/`/signup`
6. JWT `exp` claim decoded client-side to detect expiry
7. Logout clears cookie, localStorage, and reactive state, then navigates to `/login`

### Multi-Step Signup
- Step tracking stored in `sessionStorage['signup-current-step']`
- `auth.global.ts` allows `/signup` if this key is set (prevents redirect loop mid-flow)

### Shower Workflow (Status Progression)
1. **DRAFT** → Bride creates shower
2. **PREFERENCES_SET** → Bride sets preferences
3. **CATALOG_IN_PROGRESS** → Admin begins catalog
4. **CATALOG_READY** → Admin completes catalog, awaiting bride approval
5. **APPROVED** → Bride approves
6. **COMPLETED** → Event completed

### Shower Entity Structure
- `ID`, `guests`, `shower_date`, `wedding_date`, `location`
- `host_id`, `host` — nested `User` (username, email, phone_number, role)
- `catalog_id`, `catalog` — nested `Catalog` (approved, url, package, products)
- `preferences_id`, `preferences` — nested `ShowerPreferences`:
  - `style`, `notes`, `favoriteColors[]`
  - `preferredBra`, `preferredModel`, `preferredPanties`, `size`
  - `allowedModels[]`, `notAllowedModels`

### Types (`app/types/index.ts`)
- **Enums:** `UserRole` (BRIDE=1, ADMIN=2), `ShowerStatus`, `CatalogStatus`
- **Interfaces:** `User`, `AuthState`, `LoginCredentials`, `LoginResponse`, `Shower`, `ShowerPreferences`, `Catalog`, `Product`, `Review`, `ApiResponse<T>`

---

## Configuration

### Environment Variables
```
NUXT_PUBLIC_API_BASE=http://localhost:8080
```

### Nuxt Config Highlights
- `ssr: true` — but all auth checks use `import.meta.client`
- `ui.colorMode: false` — dark mode disabled
- Modules: `@nuxt/content`, `@nuxt/eslint`, `@nuxt/image`, `@nuxt/scripts`, `@nuxt/test-utils`, `@nuxt/ui`

### Color Theme (`assets/css/main.css` + `app.config.ts`)
- Primary: custom `brand` palette (brownish, ~`#a66155`)
- Secondary: custom `rose` palette (~`#dfb3a4`)
- Override via CSS variables: `--ui-primary`, `--ui-secondary`

### Deployment
- Firebase hosting configured (`firebase.json`, `.firebaserc`)

