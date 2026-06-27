import * as cryptokey from './browser.cryptokey.ts';
import * as subtle from './browser.subtle.ts';

export type StringSingerSecret = string | BufferSource | CryptoKey;

export async function sign(val: string, secret: StringSingerSecret): Promise<string> {
  if (typeof val !== 'string') {
    throw new TypeError('Cookie value must be provided as a string.');
  }

  if (secret == null) {
    throw new TypeError('Secret key must be provided.');
  }

  if (secret instanceof CryptoKey) {
    return cryptokey.sign(val, secret);
  }

  return subtle.sign(val, secret);
}

export async function unsign(
  input: string,
  secret: StringSingerSecret,
): Promise<string | false> {
  if (typeof input !== 'string') {
    throw new TypeError('Signed cookie string must be provided.');
  }

  if (secret == null) {
    throw new TypeError('Secret key must be provided.');
  }

  if (secret instanceof CryptoKey) {
    return cryptokey.unsign(input, secret);
  }

  const lastDot = input.lastIndexOf('.');
  if (lastDot === -1) {
    return false;
  }

  return subtle.unsign(input, secret);
}
