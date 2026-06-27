import { sign, unsign } from './browser.ts';

describe.concurrent('lib-string-singer-browser', () => {
  test('signs and unsigns a value', async () => {
    const secret = 'keyboard cat';
    const signed = await sign('hello', secret);

    expect(signed).toMatch(/^hello\.[-A-Za-z\d+/]+$/);
    expect(await unsign(signed, secret)).toBe('hello');
  });

  test('returns false for tampered signatures', async () => {
    const secret = 'keyboard cat';
    const signed = await sign('hello', secret);
    const tampered = `${signed}x`;

    expect(await unsign(tampered, secret)).toBe(false);
  });

  test('returns false for malformed signed input', async () => {
    expect(await unsign('abc', 'keyboard cat')).toBe(false);
  });

  test('throws for invalid inputs and missing secrets', async () => {
    await expect(sign(123 as unknown as string, 'secret')).rejects.toThrow(TypeError);
    await expect(sign('hello', undefined as unknown as string)).rejects.toThrow(
      'Secret key must be provided.',
    );
    await expect(unsign(123 as unknown as string, 'secret')).rejects.toThrow(TypeError);
    await expect(unsign('hello.signature', undefined as unknown as string)).rejects.toThrow(
      'Secret key must be provided.',
    );
  });

  test('handles BufferSource and CryptoKey secrets', async () => {
    const encoder = new TextEncoder();
    const secretBuffer = encoder.encode('keyboard cat');
    const signed = await sign('hello', secretBuffer);
    expect(await unsign(signed, secretBuffer)).toBe('hello');

    const cryptoKey = await globalThis.crypto.subtle.importKey(
      'raw',
      secretBuffer,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify'],
    );
    const signedWithKey = await sign('hello', cryptoKey);
    expect(await unsign(signedWithKey, cryptoKey)).toBe('hello');
    expect(await unsign('abc', cryptoKey)).toBe(false);
  });

  test('returns false for invalid secret causing importKey to throw', async () => {
    expect(await unsign('hello.signature', {} as any)).toBe(false);
  });

  test('returns false for invalid base64url characters in signature', async () => {
    expect(await unsign('hello.!!!', 'secret')).toBe(false);
  });
});
