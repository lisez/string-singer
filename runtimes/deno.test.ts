import { sign, unsign } from './deno.ts';
import { assertEquals, assertRejects, assertMatch } from 'jsr:@std/assert';

Deno.test('signs and unsigns a value', async () => {
  const secret = 'keyboard cat';
  const signed = await sign('hello', secret);

  assertMatch(signed, /^hello\.[-A-Za-z\d+/]+$/);
  assertEquals(await unsign(signed, secret), 'hello');
});

Deno.test('returns false for tampered signatures', async () => {
  const secret = 'keyboard cat';
  const signed = await sign('hello', secret);
  const tampered = `${signed}x`;

  assertEquals(await unsign(tampered, secret), false);
});

Deno.test('returns false for malformed signed input', async () => {
  assertEquals(await unsign('abc', 'keyboard cat'), false);
});

Deno.test('throws for invalid inputs and missing secrets', async () => {
  await assertRejects(() => sign(123 as unknown as string, 'secret'), TypeError);
  await assertRejects(() => sign('hello', undefined as unknown as string), TypeError);
  await assertRejects(() => unsign(123 as unknown as string, 'secret'), TypeError);
  await assertRejects(() => unsign('hello.signature', undefined as unknown as string), TypeError);
});

Deno.test('handles BufferSource and CryptoKey secrets', async () => {
  const encoder = new TextEncoder();
  const secretBuffer = encoder.encode('keyboard cat');
  const signed = await sign('hello', secretBuffer);
  assertEquals(await unsign(signed, secretBuffer), 'hello');

  const cryptoKey = await globalThis.crypto.subtle.importKey(
    'raw',
    secretBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
  const signedWithKey = await sign('hello', cryptoKey);
  assertEquals(await unsign(signedWithKey, cryptoKey), 'hello');
  assertEquals(await unsign('abc', cryptoKey), false);
});

Deno.test('returns false for invalid secret causing importKey to throw', async () => {
  assertEquals(await unsign('hello.signature', {} as any), false);
});

Deno.test('returns false for invalid base64url characters in signature', async () => {
  assertEquals(await unsign('hello.!!!', 'secret'), false);
});
