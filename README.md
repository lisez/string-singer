# string-singer

![NPM License](https://img.shields.io/npm/l/string-singer) ![NPM Version](https://img.shields.io/npm/v/string-singer)

A lightweight, secure, and runtime-agnostic library for signing and unsigning strings (like cookies) using HMAC-SHA256. Works out-of-the-box on Node.js, Deno, Bun, and modern browsers.

[**Try the Interactive Demo**](https://lisez.github.io/string-singer/)

_Inspired by and compatible in spirit with [tj/node-cookie-signature](https://github.com/tj/node-cookie-signature), but modernized with TypeScript first and native Web Cryptography support._

## Features

- **Runtime Agnostic**: Runs everywhere—Node.js, Deno, Bun, and standard web browsers.
- **Web Crypto Support**: Uses native `globalThis.crypto.subtle` for fast, standard-compliant cryptography in browsers and edge environments.
- **Node.js Sync Fallback**: Includes a fast, synchronous adapter using native `node:crypto`.
- **Timing-Attack Safe**: Uses constant-time comparisons (`timingSafeEqual` or `subtle.verify`) to prevent timing attacks.
- **TypeScript Native**: Full type safety out-of-the-box.

---

## Installation

Install using your preferred package manager:

**npm**

```bash
npm install string-singer
```

**yarn**

```bash
yarn add string-singer
```

**pnpm**

```bash
pnpm add string-singer
```

**bun**

```bash
bun add string-singer
```

---

## Usage

### 🟢 Node.js (Sync)

The default entry point provides synchronous signing and unsigning via the native `node:crypto` module.

```typescript
import { sign, unsign } from 'string-singer';

const secret = 'keyboard cat'; // string, NodeJS.ArrayBufferView, or KeyObject

// Sign a value
const signed = sign('hello', secret);
console.log(signed); // "hello.XXXXX..."

// Unsign and verify a value
const unsigned = unsign(signed, secret);
console.log(unsigned); // "hello" (or false if tampered)
```

### 🌐 Universal (Async) — Browsers, Deno, Bun, Edge

For environments requiring the Web Cryptography API, import from the specific subpath:

```typescript
import { sign, unsign } from 'string-singer/browser'; // or string-singer/deno /bun

const secret = 'keyboard cat'; // string, BufferSource, or CryptoKey

// Sign a value
const signed = await sign('hello', secret);
console.log(signed); // "hello.XXXXX..."

// Unsign and verify a value
const unsigned = await unsign(signed, secret);
console.log(unsigned); // "hello" (or false if tampered)
```

---

## Migrating from `cookie-signature`

If you are migrating from [cookie-signature](https://github.com/tj/node-cookie-signature), `string-singer` provides a modernized, TypeScript-first replacement. There is, however, a minor difference in the signature encoding.

### Key Differences

| Feature              | `cookie-signature`                      | `string-singer`                                            |
| :------------------- | :-------------------------------------- | :--------------------------------------------------------- |
| **Runtime Support**  | Node.js only                            | Node.js, Browsers, Deno, Bun, Cloudflare Workers, etc.     |
| **Execution**        | Synchronous only                        | Synchronous (Node) & Asynchronous (Universal / Web Crypto) |
| **Signature Format** | Base64 (with `+`, `/` and stripped `=`) | Base64URL (with `-`, `_` and stripped `=`)                 |
| **Type Safety**      | JavaScript / Manual typings             | Native TypeScript first                                    |

---

### API Mapping

For Node.js (synchronous usage), the APIs are drop-in replacements:

```typescript
// Before (cookie-signature)
import { sign, unsign } from 'cookie-signature';

const signed = sign('hello', 'secret');
const value = unsign(signed, 'secret');
```

```typescript
// After (string-singer)
import { sign, unsign } from 'string-singer';

const signed = sign('hello', 'secret');
const value = unsign(signed, 'secret');
```

---

### Signature Encoding Difference

`cookie-signature` uses standard Base64 (with `+` and `/`), while `string-singer` uses URL-safe Base64URL (with `-` and `_`).

To verify legacy `cookie-signature` values, replace standard Base64 characters with their URL-safe equivalents (`+` to `-`, `/` to `_`) before calling `unsign`.

---

## Architecture & Exports

The library is structured as follows:

- **`string-singer` (default) & `string-singer/node`**: Synchronous Node.js implementation.
- **`string-singer/browser`**: Asynchronous browser/edge Web Crypto implementation.
- **`string-singer/deno`**: Asynchronous Deno adapter.
- **`string-singer/bun`**: Asynchronous Bun adapter.
- **`utils/base64.ts`**: URL-safe base64 helper functions (`bytesToBase64Url`, `base64UrlToBytes`).

---

## Development & Testing

### Running Tests

- **Node.js & Browser (Vitest)**:
  ```bash
  npm test
  ```
- **Deno**:
  ```bash
  deno test --allow-net runtimes/deno.test.ts
  ```
- **Bun**:
  ```bash
  bun test runtimes/bun.test.ts
  ```

### Demo

- **Online**: Visit the [live demo site](https://lisez.github.io/string-singer/).
- **Local Dev**:
  ```bash
  npm run dev:demo
  ```

---

## License

[MIT](LICENSE)
