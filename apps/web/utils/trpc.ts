import { config } from '@/config/configServer'

function getBaseUrl() {
  if (typeof window !== 'undefined')
    return '';
  if (config.vercel.url)
    return `https://${config.vercel.url}`;
  if (config.render.hostname)
    return `http://${config.render.hostname}:${config.port}`; 
  return `http://localhost:${config.port ?? 3000}`;
}

export function getUrl() {
  return `${getBaseUrl()}/api/trpc`;
}