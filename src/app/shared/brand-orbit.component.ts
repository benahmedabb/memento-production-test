import { Component } from '@angular/core';

@Component({
  selector: 'app-brand-orbit',
  host: { 'aria-hidden': 'true', class: 'brand-orbit' },
  template: `
    <svg viewBox="0 0 500 500" fill="none" focusable="false">
      <g class="brand-orbit__drawing" stroke="currentColor">
        <circle cx="250" cy="250" r="215" pathLength="1" />
        <circle cx="250" cy="250" r="188" pathLength="1" />
        <ellipse cx="250" cy="250" rx="215" ry="95" transform="rotate(-38 250 250)" pathLength="1" />
        <ellipse cx="250" cy="250" rx="215" ry="95" transform="rotate(38 250 250)" pathLength="1" />
        <path d="M250 13v36m0 402v36M13 250h36m402 0h36M235 250h30m-15-15v30" />
      </g>
      <circle class="brand-orbit__point" cx="402" cy="98" r="6" fill="currentColor" />
    </svg>
  `,
})
export class BrandOrbitComponent {}
