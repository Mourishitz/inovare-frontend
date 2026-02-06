# Inovare Frontend - Copilot Instructions

This is a **Nuxt 4** application for managing bridal lingerie shower events (chás de lingerie). The application connects to a backend API and provides role-based interfaces for brides/hosts and administrators.

## Build, Test, and Lint

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
npm run preview  # Preview production build locally
```

### Linting
ESLint is configured via `@nuxt/eslint` module:
```bash
npx eslint .
```

## Architecture

### Role-Based Access
- **BRIDE (role: 1)**: Creates and manages their own showers, sets preferences, reviews catalogs
- **ADMIN (role: 2)**: Manages all showers, creates product catalogs for brides

### Authentication Flow
1. Users authenticate via `/api/login` endpoint (backend)
2. JWT token and user object stored in localStorage (client-side persistence)
3. Token automatically included in API requests via `useApi()` composable
4. Three middleware layers protect routes:
   - `auth.ts` - Requires authentication
   - `user.ts` - BRIDE role only
   - `admin.ts` - ADMIN role only

### Shower Workflow (Status Progression)
1. **DRAFT** → Bride creates shower
2. **PREFERENCES_SET** → Bride sets theme, budget, guest count, special requests
3. **CATALOG_IN_PROGRESS** → Admin begins creating product catalog
4. **CATALOG_READY** → Admin completes catalog, awaiting bride approval
5. **APPROVED** → Bride approves catalog
6. **COMPLETED** → Event completed

### Key Files and Patterns

#### Composables
- `useApi()` - Centralized API client with automatic auth headers
  - Wraps `$fetch` with `NUXT_PUBLIC_API_BASE` config
  - Logs requests/responses for debugging
- `useAuth()` - Authentication state management
  - Uses Nuxt's `useState` for reactivity
  - Provides computed properties: `isAuthenticated`, `isAdmin`, `isBride`

#### Type System
All types defined in `app/types/index.ts`:
- `User`, `Shower`, `Product`, `Catalog`
- Enums: `UserRole`, `ShowerStatus`, `CatalogStatus`

#### Layouts
- `default.vue` - Public pages
- `auth.vue` - Login/signup pages
- `authenticated.vue` - Logged-in user pages (header with logout)
- `admin.vue` - Admin pages (extends authenticated with admin navigation)

#### Route Protection
Use `definePageMeta()` in pages:
```typescript
definePageMeta({
  middleware: ['auth', 'admin'],  // Chain middleware
  layout: 'admin'
})
```

## Configuration

### Environment Variables
Configure in `.env` (see `.env.example`):
- `NUXT_PUBLIC_API_BASE` - Backend API URL (default: `http://localhost:8080`)

### Nuxt Config
- Color mode disabled: `ui.colorMode: false`
- Runtime config exposes `apiBase` to client

## Conventions

### Component Library
Uses **@nuxt/ui** (TailwindCSS-based):
- `UButton`, `UCard`, `UBadge`, `UApp` components
- Iconify icons via `@iconify-json/heroicons`

### Localization
Portuguese (pt-BR) is the primary language for UI labels and content.

### File Structure
Standard Nuxt conventions:
- `app/pages/` - Auto-routed pages
- `app/layouts/` - Reusable layouts
- `app/middleware/` - Route middleware
- `app/composables/` - Auto-imported composables
- `app/components/` - Auto-imported components
- `app/content/` - Nuxt Content module docs

### Date Formatting
Use Brazilian format via `toLocaleDateString('pt-BR')`.

### Status Mapping
When displaying shower statuses, map enum values to Portuguese labels:
```typescript
{
  [ShowerStatus.DRAFT]: 'Rascunho',
  [ShowerStatus.PREFERENCES_SET]: 'Preferências Definidas',
  // ... etc
}
```
