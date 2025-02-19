import { parse } from 'cookie';

export function parsedTostring(parsedCookie: ReturnType<typeof parse>) {
  const cookieKeys = Object.keys(parsedCookie);
  const cookieName = cookieKeys[0] as string;
  const cookieValue = parsedCookie[cookieName];
  const attributeKeys = cookieKeys.slice(1);
  return `${cookieName}=${cookieValue}${attributeKeys.length > 0 ? `; ${attributeKeys.map((key) => `${key}=${parsedCookie[key]}`).join('; ')}` : ''}`;
}