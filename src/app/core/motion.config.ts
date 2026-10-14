// Keep in sync with the mobile motion media query in styles.scss.
export const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
export const lightweightMotionQuery = `(max-width: 859px), (pointer: coarse), ${reducedMotionQuery}`;
// Shared by the early camera download, the component and its fallback picture.
export const heroCameraMotionQuery = '(min-width: 860px) and (pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)';
