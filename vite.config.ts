import { configDefaults, defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['index.ts', 'runtimes/**/*', 'utils/**/*'],
      exclude: ['**/*.test.ts', 'demo/**/*'],
      outDir: 'dist',
    }),
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: {
        index: 'index.ts',
        node: 'runtimes/node.ts',
        deno: 'runtimes/deno.ts',
        bun: 'runtimes/bun.ts',
        browser: 'runtimes/browser.ts',
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['node:crypto'],
    },
  },
  test: {
    globals: true,
    exclude: [
      ...configDefaults.exclude,
      '**/deno.test.ts',
      '**/bun.test.ts',
    ],
  },
});
