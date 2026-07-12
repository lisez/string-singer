import * as cryptokey from './browser.cryptokey.ts';

export async function sign(
  val: string,
  secret: string | BufferSource,
): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = typeof secret === 'string' ? encoder.encode(secret) : secret;

  const cryptoKey = await globalThis.crypto.subtle.importKey(
    'raw',
    keyData as any,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );

  return cryptokey.sign(val, cryptoKey);
}

export async function unsign(
  input: string,
  secret: string | BufferSource,
): Promise<string | false> {
  const encoder = new TextEncoder();
  const keyData = typeof secret === 'string' ? encoder.encode(secret) : secret;

  let cryptoKey: CryptoKey;
  try {
    cryptoKey = await globalThis.crypto.subtle.importKey(
      'raw',
      keyData as any,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify'],
    );
  } catch {
    return false;
  }

  return cryptokey.unsign(input, cryptoKey);
}
