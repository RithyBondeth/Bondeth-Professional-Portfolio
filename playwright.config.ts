import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  outputDir: "./tmp/playwright",
  use: {
    baseURL: "http://127.0.0.1:18992",
    timezoneId: "America/Los_Angeles",
  },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 18992",
    url: "http://127.0.0.1:18992/en/blog",
  },
});
