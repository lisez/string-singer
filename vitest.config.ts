import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    exclude: [
      ...configDefaults.exclude,
      '**/deno.test.ts',
      '**/bun.test.ts',
    ],
  },
});
