/** Keep the Apache rules in public/.htaccess aligned with these permanent moves. */
export const serviceRedirects = [
  { from: '/produzione-video-fotografia', to: '/video' },
  { from: '/social-media', to: '/social' },
  { from: '/grafica-branding', to: '/grafica' },
  { from: '/branding-siti-web', to: '/grafica' },
  { from: '/siti-web-ecommerce', to: '/web' },
] as const;
