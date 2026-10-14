import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { heroCameraMotionQuery } from './app/core/motion.config';

// Download the same lazy module used by the hero while Angular starts up.
// Do not create a WebGL context here, or load Three.js on other pages/mobile.
const homePath = new URL(document.baseURI).pathname;
if (
  (window.location.pathname === homePath || window.location.pathname === `${homePath}index.html`)
  && !document.hidden
  && window.matchMedia?.(heroCameraMotionQuery).matches
  && 'IntersectionObserver' in window
  && 'ResizeObserver' in window
) {
  void import('./app/shared/camera-scene').catch(() => {
    // The hero owns error handling and will restore its original fallback photo.
  });
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
