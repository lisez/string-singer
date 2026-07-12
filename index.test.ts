import { sign, unsign } from '#internal/index.ts';

describe.concurrent('lib-string-singer', () => {
  test('signs and unsigns a value', () => {
    const secret = 'keyboard cat';
    const signed = sign('hello', secret);

    expect(signed).toMatch(/^hello\.[-A-Za-z\d+/]+$/);
    expect(unsign(signed, secret)).toBe('hello');
  });

  test('returns false for tampered signatures', () => {
    const secret = 'keyboard cat';
    const signed = sign('hello', secret);
    const tampered = `${signed}x`;

    expect(unsign(tampered, secret)).toBe(false);
  });

  test('returns false for malformed signed input', () => {
    expect(unsign('abc', 'keyboard cat')).toBe(false);
  });

  test('throws for invalid inputs and missing secrets', () => {
    expect(() => sign(123 as unknown as string, 'secret')).toThrow(TypeError);
    expect(() => sign('hello', undefined as unknown as string)).toThrow(
      'Secret key must be provided.',
    );
    expect(() => unsign(123 as unknown as string, 'secret')).toThrow(TypeError);
    expect(() =>
      unsign('hello.signature', undefined as unknown as string),
    ).toThrow('Secret key must be provided.');
  });

  test('returns false for invalid secret causing error in createHmac', () => {
    expect(unsign('hello.signature', {} as any)).toBe(false);
  });
});
