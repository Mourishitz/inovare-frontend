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
**No tests currently configured.** If adding tests:
```bash
# Run all tests (requires vitest setup)
npx vitest run

# Run a single test file
npx vitest run path/to/test.spec.ts

# Watch mode
npx vitest
```

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
- Components auto-imported; no explicit imports needed

**Pages (`app/pages/`):**
- Use `definePageMeta()` for route configuration
- Set middleware and layout per page
- Use `navigateTo()` for routing

**Middleware (`app/middleware/`):**
- `auth.ts` - Requires authentication
- `user.ts` - BRIDE role only
- `admin.ts` - ADMIN role only
- Chain middleware: `definePageMeta({ middleware: ['auth', 'admin'] })`

### Component Library (@nuxt/ui)
- Primary components: `UButton`, `UCard`, `UInput`, `UBadge`, `UAlert`, `UForm`, `UFormField`
- Use `ClientOnly` wrapper for client-side only components
- Icons via Heroicons: `i-heroicons-xxx`
- TailwindCSS utility classes for styling

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

// 3. Component/Composable imports (if needed)
import { useAuth } from '~/composables/useAuth'

// 4. Local component imports (rarely needed due to auto-import)
```

### Error Handling
- Use try/catch in async functions
- Display errors to users via `UAlert` component
- Log errors to console for debugging
- Handle API errors in composables and propagate meaningful messages

### API Calls
- Use `useApi()` composable for authenticated requests
- Token automatically included via Authorization header
- Always handle errors and show user feedback
- Log requests/responses for debugging (already built into useApi)

### Layouts (`app/layouts/`)
- `default.vue` - Public pages
- `auth.vue` - Login/signup pages
- `authenticated.vue` - Logged-in user pages
- `admin.vue` - Admin pages with navigation

---

## Architecture

### Role-Based Access
- **BRIDE (role: 1):** Creates/manages showers, sets preferences, reviews catalogs
- **ADMIN (role: 2):** Manages all showers, creates product catalogs

### Authentication Flow
1. Login via `/api/login` endpoint (backend)
2. JWT token + user object stored in cookie (`auth-token`) and localStorage
3. Token automatically included in API requests via `useApi()` composable

### Shower Entity Structure
The Shower entity has these main fields:
- `ID` - Unique identifier
- `guests` - Number of guests
- `shower_date` - Date of the shower event
- `wedding_date` - Date of the wedding
- `location` - Event location
- `host_id` - ID of the bride hosting
- `host` - Nested User object (username, email, phone_number, role)
- `catalog_id` - Associated catalog ID (may be null)
- `catalog` - Nested Catalog object (approved, url, package)
- `preferences_id` - Associated preferences ID (may be null)
- `preferences` - Nested Preferences object:
  - `style` - e.g., "Sensual", "Romântico"
  - `notes` - Additional notes
  - `favoriteColors` - Array of colors
  - `preferredBra`, `preferredModel`, `preferredPanties` - Lingerie preferences
  - `size` - Size preference
  - `allowedModels`, `notAllowedModels` - Model restrictions

---

## Configuration

### Environment Variables
Create `.env` file:
```
NUXT_PUBLIC_API_BASE=http://localhost:8080
```

### Date Formatting
Use Brazilian format: `date.toLocaleDateString('pt-BR')`

---

## Additional Conventions (from Copilot Instructions)

- Portuguese (pt-BR) is the primary language for all UI labels and content
- Color mode disabled in Nuxt config: `ui.colorMode: false`
- Runtime config exposes `apiBase` to client via `public.apiBase`
- Use `import.meta.client` for browser-only code
