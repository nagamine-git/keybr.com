# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

keybr.com is a touch typing learning application built with React, TypeScript, and Node.js. It uses a monorepo structure with multiple packages managed by npm workspaces. The application consists of a Node.js server backend and a webpack-bundled browser frontend.

## Commands

### Setup and Installation
```bash
npm install                          # Install all dependencies
cp .env.example /etc/keybr/env      # Create config file (recommended global location)
./packages/devenv/lib/initdb.ts     # Initialize database and create example users
```

### Development
```bash
npm start                            # Start dev server at http://localhost:3000
npm run watch                        # Auto-rebuild on file changes (run alongside npm start)
npm run compile                      # Compile TypeScript for all packages
npm run build-dev                    # Build webpack bundles in development mode
npm run build                        # Build webpack bundles in production mode
```

### Testing
```bash
env DATABASE_CLIENT=sqlite npm test # Run all tests
npm test --workspace=@keybr/lesson  # Run tests for specific package
```

### Linting and Formatting
```bash
npm run lint                         # Lint JavaScript/TypeScript files
npm run lint-fix                     # Auto-fix linting issues
npm run stylelint                    # Lint CSS/LESS files
npm run stylelint-fix                # Auto-fix style issues
npm run format                       # Format code with Prettier
```

### Package Management
```bash
npm run clean                        # Clean all build artifacts
lage compile --no-cache             # Compile using lage build system
lage test --no-cache                # Test using lage build system
```

### Language and Content Generation
```bash
npm --workspace packages/keybr-generators run generate-languages  # Generate phonetic models
npm run translate                                                  # Translation utilities
```

## Architecture

### Monorepo Structure

The codebase is organized as an npm workspace monorepo with 60+ packages in `packages/`:

**Core Domain Packages:**
- `keybr-lesson` - Lesson generation logic and learning algorithms
- `keybr-keyboard` - Keyboard layouts and language definitions
- `keybr-phonetic-model` - Statistical language models for word generation
- `keybr-result` - Typing test results and statistics
- `keybr-settings` - User settings and preferences
- `keybr-textinput` - Text input handling and validation

**UI Packages:**
- `keybr-widget` - Shared UI components
- `keybr-lesson-ui` - Lesson-related UI components
- `keybr-keyboard-ui` - Keyboard visualization components
- `keybr-textinput-ui` - Text input UI components
- `keybr-chart` - Charting and data visualization

**Page Packages:**
- `page-practice` - Main practice page
- `page-profile` - User profile page
- `page-account` - Account management
- `page-typing-test` - Typing test page
- `page-multiplayer` - Multiplayer mode
- `page-highscores` - Leaderboards
- `page-layouts` - Keyboard layout browser
- `page-help` - Help and documentation

**Infrastructure:**
- `server` - Main Node.js server application
- `server-cli` - CLI tools
- `keybr-database` - Database models and migrations (Knex + Objection.js)
- `keybr-pages-browser` - Browser entry point and routing
- `keybr-pages-server` - Server-side rendering
- `keybr-oauth` - OAuth authentication
- `test-env-*` - Test environment setup packages

### Application Entry Points

**Server:** `packages/server/lib/main.ts`
- Uses Node.js cluster module for multi-process architecture
- Forks 4 HTTP worker processes (port 3000 by default)
- Forks 1 WebSocket worker process for multiplayer (port 3001)
- Each worker automatically restarts on failure

**Browser:** `packages/keybr-pages-browser/lib/entry.ts`
- Main React application entry point
- Uses React Router for client-side routing
- Lazy-loads page components

### Web Framework

The server uses a custom framework called `@fastr/*`:
- `@fastr/core` - Core application framework
- `@fastr/invert` - Dependency injection container
- `@fastr/middleware-*` - Express-like middleware
- Middleware are composed in `packages/server/lib/app/module.ts`

### Database

- **ORM:** Knex query builder + Objection.js models
- **Supported databases:** SQLite (dev), MySQL (production), better-sqlite3
- **Schema:** Defined in `packages/keybr-database/lib/model.ts`
- **Main tables:** User, UserExternalId, Order, UserLoginRequest
- **Data loaders:** Packages like `keybr-result-loader`, `keybr-settings-loader` handle data persistence

### Build System

**Webpack Configuration:** `webpack.config.js`
- Two separate builds: "server" (Node.js target) and "browser" (web target)
- Server build outputs to `root/lib/`
- Browser build outputs to `root/public/assets/`
- Uses content hashing for production builds
- Shared chunks: vendor libraries, widgets, keyboard components
- CSS extraction with MiniCssExtractPlugin
- LESS preprocessing with CSS Modules (camelCase, hashed class names)
- TypeScript compiled with ts-loader
- Compression (gzip + brotli) in production

**Task Runner:** Uses `lage` for orchestrating package builds and tests across the monorepo.

**TypeScript:** Each package has its own `tsconfig.json` extending template configs from `packages/tsconfig-template*.json`

### Internationalization

- Uses `react-intl` for i18n
- Custom transformer `@keybr/scripts/intl-transformer.js` extracts and compiles messages
- Translation workflow via POEditor (see `scripts/poeditor-pull.js`)
- Messages defined inline with `formatMessage` and enforced by ESLint rules

### Code Generation and Grammars

The `keybr-code` package includes:
- Programming language syntax parsers and grammars
- Code generation for practice lessons
- Grammar files in `packages/keybr-code/lib/syntax/`

### Lesson Generation Algorithm

The core typing lesson algorithm:
1. **Phonetic model** generates realistic words based on language statistics
2. **Key progression** system adds letters incrementally based on user performance
3. **Target speed** tracking adapts difficulty to user's skill level
4. **Statistics collection** tracks per-key speed and accuracy
5. **Learning rate** calculations predict progress

Key packages: `keybr-lesson`, `keybr-phonetic-model`, `keybr-learningrate`

### State Management

- React Context API for global state (no Redux)
- Settings stored in database and loaded via data loaders
- Real-time updates via WebSocket for multiplayer mode

## Package Dependencies

Packages use `*` for internal dependencies in package.json, resolved via workspace protocol. External dependencies are pinned versions. When adding a new package dependency:
- Use `@keybr/*` namespace for internal packages
- Add to `dependencies` in package.json
- Import with `.js` extension (required by ESLint)

## Testing

- Test runner: Custom `tstest` command (defined in package scripts)
- Test environment packages provide setup: `test-env-browser`, `test-env-bundler`, `test-env-server`
- Testing libraries: `@testing-library/react`, `@testing-library/dom`, `@testing-library/user-event`
- Tests located alongside source: `lib/**/*.test.{ts,tsx}`
- SQLite required for tests: `env DATABASE_CLIENT=sqlite npm test`

## Code Style

**ESLint config:** `eslint.config.js` (Flat config format)
- Enforces type imports with `@typescript-eslint/consistent-type-imports`
- Requires `.js` file extensions in imports (`n/file-extension-in-import`)
- Import sorting with `eslint-plugin-simple-import-sort`
- React hooks rules enforced in browser code
- formatjs rules for i18n message validation

**TypeScript conventions:**
- Prefer `type` over `interface` (enforced)
- Use inline type imports: `import { type Foo } from "./foo.js"`
- Decorators enabled for dependency injection

**React conventions:**
- JSX runtime (no React import needed)
- Fragments use `<>` syntax
- Boolean props always explicit: `<Foo bar={true} />`
- Handler names follow convention (enforced by `react/jsx-handler-names`)

## Adding New Features

### Adding a Language
See `docs/custom_language.md`:
1. Define language in `packages/keybr-keyboard/lib/language.ts`
2. Add dictionary file: `packages/keybr-generators/dictionaries/dictionary-<id>.csv.gz`
3. Run `npm --workspace packages/keybr-generators run generate-languages`
4. Commit generated model and word list files

### Adding a Keyboard Layout
See `docs/custom_keyboard.md` for the process.

### Adding a Page
1. Create package in `packages/page-<name>/`
2. Export main component from `lib/index.ts`
3. Add route in `packages/keybr-pages-browser/lib/pages/`
4. Import and register in routing configuration

## Configuration

**Environment variables:** Configured via `.env` or `/etc/keybr/env`
- `APP_URL` - Application URL
- `DATABASE_CLIENT` - Database type (sqlite/mysql)
- `DATABASE_FILENAME` - SQLite database path
- `DATA_DIR` - Data directory location
- `COOKIE_DOMAIN`, `COOKIE_SECURE` - Cookie settings
- `MAIL_*` - Email configuration

## Important Notes

- **Node version:** Requires Node.js v24+
- **File extensions:** All imports must include `.js` extension (enforced)
- **Module type:** Package is ESM (`"type": "module"`)
- **Port 80/443:** Requires capability: `sudo setcap cap_net_bind_service=+ep $(which node)`
- **Character encoding:** Extensive Unicode support via `@keybr/unicode` package
