# AI Copilot Instructions for shop-acc-nuxt

## Project Overview
**shop-acc-nuxt** is a Vietnamese game account marketplace built with Nuxt 2 (SSR disabled). It manages game account listings, purchases, user authentication, and account balance tracking with real-time WebSocket integration.

## Architecture & Data Flow

### Core Stack
- **Framework**: Nuxt 2 (CSR only - `ssr: false` in nuxt.config.js)
- **UI**: Vuetify components, Tailwind CSS (via CDN)
- **State**: Vuex with two store modules: `index.js` (auth/user) and `modals.js` (modal states)
- **API Communication**: Axios with custom middleware for MD5 request signing
- **Real-time**: WebSocket via `ws` library (client-only plugin)
- **Notifications**: vue-toastification

### Key Data Flows
1. **Authentication**: `auth.js` (api) → axios request → backend returns token → Vuex `setToken` + `setIsAuthenticated` → stored in cookies + state
2. **Account Listing**: Components call api modules (e.g., `account.getCategoryList()`) → wrapped in Promise → updates component data
3. **User Context**: Token persists via `js-cookie`; middleware/auth.js restores session on route load if token exists
4. **Modals**: Global state in `store/modals.js` controls CookieConsent, PolicyModal, PromoModal visibility

### API Pattern
All API calls in `/api/*.js` follow this convention:
```javascript
export default {
  methodName(params) {
    return new Promise((resolve, reject) => {
      axios.method(`/api/Endpoint`, { params/data })
        .then(res => resolve(res?.data))
        .catch(err => reject(err))
    })
  }
}
```
Backend endpoints are PascalCase (e.g., `/api/Auth/Login`, `/api/Account/GetListCategory`).

### Axios Security Middleware
Request signing in `plugins/axios.js` adds MD5 hash headers:
- Computes contentMD5 from request body (POST/PUT/PATCH) or query params (GET)
- Includes request timestamp in format `yyyyMMddHHmmss`
- Requires `NUXT_ENV_API_KEY` and `NUXT_ENV_BASE_URL` environment variables

## Component Patterns

### Standard Vue Component Structure
```vue
<template>
  <!-- Uses nuxt-link for routing, :to bindings for dynamic routes -->
</template>

<script>
import apiModule from '~/api/moduleName'
export default {
  name: "ComponentName",
  data() { return { stateVar: defaultValue } },
  mounted() { this.fetchData() },
  methods: {
    fetchData() {
      apiModule.method()
        .then(res => { if (res.success) { /* update data */ } })
        .catch(err => console.error(err))
    }
  }
}
</script>
```

### Pages & Routing
- Dynamic routes use underscore convention: `_accountID.vue`, `_typeAccount.vue`, `_categoryId.vue`
- Route params accessed via `this.$route.params` or `this.$route.query`
- Examples: `/AccountCategories/[categoryId]`, `/DetailAccountPage/[accountID]`

### Store Usage
- Import: `import { mapState, mapMutations } from 'vuex'` (if needed)
- Authentication state (token, user_data, isAuthenticated) in `store/index.js`
- Modal visibility in `store/modals.js` - commit mutations like `SHOW_POLICY_MODAL`
- User balance updates via `updateBalance` mutation (adds amount delta)

### Notification/Toast Pattern
```javascript
this.$toast.success('Message') // via vue-toastification plugin
this.$toast.error('Error message')
```

## File Organization

```
api/              # API wrapper modules (auth, account, order, payment, favorite)
components/       # Reusable Vue components, organized by feature (HomeComponents, UserAccountComponents, Modals)
pages/            # Nuxt routes (index.vue = /, dynamic: _paramName.vue)
store/            # Vuex modules (index.js for auth, modals.js for UI state)
middleware/       # auth.js - route protection & session restoration
plugins/          # axios.js (API config), toast.js (notifications), ws.client.js (WebSocket)
assets/           # SCSS (variables.scss for Vuetify theme), images
layouts/          # default.vue wraps all pages, error.vue for error pages
```

## Development Workflows

### Local Development
```bash
yarn install              # Install dependencies
yarn dev                  # Start dev server (http://localhost:3000)
yarn build && yarn start  # Production build and start
yarn generate             # Static generation
```

### Environment Variables Required
- `NUXT_ENV_BASE_URL`: Backend API base URL
- `NUXT_ENV_API_KEY`: Used for request signing MD5 hash

### Testing/Debugging Tips
- Token stored in cookies: inspect `js-cookie` in DevTools Application tab
- Vuex state accessible via `$store` in components and browser console
- WebSocket connection logs appear in network tab (ws://...)
- Toast messages configured with 2s timeout, max 5 concurrent notifications

## Project-Specific Conventions

### Naming
- API method names: camelCase (e.g., `getCategoryList`, `getAccountDetail`)
- Backend endpoints: PascalCase (e.g., `/api/Auth/Login`)
- Component names: PascalCase in <script>, kebab-case in templates
- Vuex mutations: UPPER_SNAKE_CASE (e.g., `SHOW_POLICY_MODAL`)

### Error Handling
- No global error interceptor visible; components handle errors locally with `catch(err => console.error(err))`
- Success check: `if (res.success)` before using `res.data`
- Consider adding centralized error handling for consistency

### Styling
- SCSS variables in `assets/styles/variables.scss` (Vuetify theme)
- Tailwind CSS injected via CDN (not ideal for optimization)
- Component styles typically scoped (`<style scoped>`)

### Auth Flow
- Public pages: (currently commented out in middleware/auth.js - all routes protected by default)
- Protected routes: require valid token in cookies
- Session restore on page load: `middleware/auth.js` checks token and calls `store.dispatch('login')`
- Logout: `store.dispatch('logout')` clears token + state

## Critical Integration Points
- **Backend API**: Requires MD5 request signing (see axios.js)
- **WebSocket**: Client-only plugin for real-time updates (`ws.client.js`)
- **Third-party**: Font Awesome 7 (CDN), Tailwind CSS (CDN), Vuetify
- **Data persistence**: Cookies for auth token, Vuex state for user data (not persisted - lost on refresh)

## Adding New Features
1. **New API endpoint**: Create method in `/api/moduleName.js` following Promise-based pattern
2. **New page**: Add `.vue` file to `/pages/` (or `/pages/Folder/_param.vue` for dynamic routes)
3. **New component**: Place in `/components/` or feature subfolder, import as needed
4. **Modal**: Add state to `store/modals.js`, trigger via `$store.commit('SHOW_XXX_MODAL')`
5. **Toast notification**: Call `this.$toast.success/error/info(message)`

## Known Limitations & TODOs
- Vuex state not persisted (resets on refresh) - consider `nuxt-persistedstate`
- Error handling is local/manual - centralize with interceptors
- Tailwind CSS via CDN is suboptimal - consider `@nuxtjs/tailwindcss` module
- All routes protected by default (public paths commented in middleware) - clarify intent
