import { base64UrlToBytes, bytesToBase64Url } from '../utils/base64.ts';

export async function sign(val: string, secret: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(val);
  const signatureBuffer = await globalThis.crypto.subtle.sign(
    'HMAC',
    secret,
    data as any,
  );

  const signature = bytesToBase64Url(new Uint8Array(signatureBuffer));
  return `${val}.${signature}`;
}

export async function unsign(
  input: string,
  secret: CryptoKey,
): Promise<string | false> {
  const lastDot = input.lastIndexOf('.');
  if (lastDot === -1) {
    return false;
  }

  const tentativeValue = input.slice(0, lastDot);
  const signatureStr = input.slice(lastDot + 1);

  try {
    const signatureBytes = base64UrlToBytes(signatureStr);
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(tentativeValue);
    const isValid = await globalThis.crypto.subtle.verify(
      'HMAC',
      secret,
      signatureBytes as any,
      dataBytes as any,
    );
    return isValid ? tentativeValue : false;
  } catch {
    return false;
  }
}
