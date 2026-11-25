import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:5199' },
  webServer: [
    { command: 'pnpm dev --port 5199', url: 'http://localhost:5199', reuseExistingServer: true },
    // The offline test needs the built app, because the service worker only exists in a production build.
    { command: 'pnpm build && pnpm preview --port 4173', url: 'http://localhost:4173', reuseExistingServer: true, timeout: 180_000 },
  ],
})
