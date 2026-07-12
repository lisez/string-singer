import fs from 'fs';
import { resolve } from 'path';
import { build } from 'vite';

const rootDir = resolve(import.meta.dirname, '..');
const distDir = resolve(rootDir, 'dist');

async function main() {
  console.log('🚀 Starting library build...');
  try {
    // 1. Run Vite build
    await build({
      configFile: resolve(rootDir, 'vite.config.ts'),
    });
    console.log('📦 Vite build completed.');

    // 2. Read root package.json
    const rootPkg = JSON.parse(
      fs.readFileSync(resolve(rootDir, 'package.json'), 'utf8')
    );

    // 3. Construct dist package.json
    const distPkg = {
      name: rootPkg.name,
      version: rootPkg.version,
      description: rootPkg.description,
      keywords: rootPkg.keywords,
      repository: rootPkg.repository,
      bugs: rootPkg.bugs,
      homepage: rootPkg.homepage,
      license: rootPkg.license,
      type: 'module',
      main: './index.cjs',
      module: './index.js',
      types: './index.d.ts',
      exports: {
        '.': {
          import: './index.js',
          require: './index.cjs',
          types: './index.d.ts',
        },
        './node': {
          import: './node.js',
          require: './node.cjs',
          types: './runtimes/node.d.ts',
        },
        './deno': {
          import: './deno.js',
          require: './deno.cjs',
          types: './runtimes/deno.d.ts',
        },
        './bun': {
          import: './bun.js',
          require: './bun.cjs',
          types: './runtimes/bun.d.ts',
        },
        './browser': {
          import: './browser.js',
          require: './browser.cjs',
          types: './runtimes/browser.d.ts',
        },
      },
    };

    // Write dist/package.json
    fs.writeFileSync(
      resolve(distDir, 'package.json'),
      JSON.stringify(distPkg, null, 2)
    );
    console.log('📝 Generated dist/package.json');

    // 4. Copy README.md and LICENSE
    fs.copyFileSync(resolve(rootDir, 'README.md'), resolve(distDir, 'README.md'));
    fs.copyFileSync(resolve(rootDir, 'LICENSE'), resolve(distDir, 'LICENSE'));
    console.log('📄 Copied README.md and LICENSE to dist/');

    console.log('✅ Library built successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

main();
