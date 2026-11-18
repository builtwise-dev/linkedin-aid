export const BASE_URL = 'https://www.linkedin.com';

const CDN_URL = (import.meta.env.WXT_CDN_URL ?? '').replace(/\/$/, '');

/** Build an absolute URL for an asset hosted on the project CDN. */
export function cdnUrl(path: string): string {
  const normalizedPath = path.replace(/^\/+/, '');
  return CDN_URL ? `${CDN_URL}/${normalizedPath}` : `/${normalizedPath}`;
}

/** Build a URL for a tool asset hosted under the CDN's /tools/ directory. */
export function cdnToolsUrl(path: string): string {
  const normalizedPath = path.replace(/^\/+/, '').replace(/^tools\//, '');
  return cdnUrl(`tools/${normalizedPath}`);
}
