export function writeStateToQueryString<T extends Record<string, Parameters<typeof encodeURIComponent>[0]>>(data: T): string {
  const keys = Object.keys(data);
  const queryString = keys.reduce((acc, key, index) => {
    return `${acc}${index!==0 ?'&':''}${key}=${data[key]}`;
  }, '');
  return queryString;
}