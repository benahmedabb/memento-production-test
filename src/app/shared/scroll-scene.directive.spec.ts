import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ScrollSceneDirective } from './scroll-scene.directive';

@Component({ imports: [ScrollSceneDirective], template: '<section appScrollScene="cover" [scrollSceneOnMobile]="mobile"></section>' })
class SceneHost { mobile = false; }

describe('ScrollSceneDirective motion policy', () => {
  let lightweight: boolean;
  let preference: EventTarget;
  let reducedPreference: EventTarget;
  let reduced: boolean;
  let pendingFrames: Map<number, FrameRequestCallback>;
  let observe: ReturnType<typeof vi.fn>;
  let disconnect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    lightweight = true;
    reduced = false;
    preference = new EventTarget();
    reducedPreference = new EventTarget();
    Object.defineProperty(preference, 'matches', { get: () => lightweight });
    Object.defineProperty(reducedPreference, 'matches', { get: () => reduced });
    vi.stubGlobal('matchMedia', vi.fn((query: string) => query === '(prefers-reduced-motion: reduce)' ? reducedPreference : preference));
    observe = vi.fn();
    disconnect = vi.fn();
    class Observer {
      observe = observe;
      disconnect = disconnect;
    }
    vi.stubGlobal('IntersectionObserver', Observer);
    vi.stubGlobal('ResizeObserver', Observer);
    pendingFrames = new Map();
    let frameId = 0;
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => {
      pendingFrames.set(++frameId, callback);
      return frameId;
    }));
    vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => { pendingFrames.delete(id); }));
    TestBed.configureTestingModule({ imports: [SceneHost] });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
  });

  async function render(mobile = false) {
    const fixture = TestBed.createComponent(SceneHost);
    fixture.componentInstance.mobile = mobile;
    fixture.detectChanges();
    await fixture.whenStable();
    const section = fixture.nativeElement.querySelector('section') as HTMLElement;
    return { fixture, section };
  }

  function flushFrame() {
    const callbacks = [...pendingFrames.values()];
    pendingFrames.clear();
    callbacks.forEach((callback) => callback(0));
  }

  it('does not observe or schedule scroll work in lightweight mode', async () => {
    const { section } = await render();
    window.dispatchEvent(new Event('scroll'));
    expect(section.classList.contains('scroll-scene--active')).toBe(false);
    expect(observe).not.toHaveBeenCalled();
    expect(pendingFrames.size).toBe(0);
  });

  it('allows an opted-in mobile scene while respecting reduced motion', async () => {
    const { section } = await render(true);
    flushFrame();
    expect(section.classList.contains('scroll-scene--active')).toBe(true);
    expect(section.style.getPropertyValue('--scene-progress')).not.toBe('');

    reduced = true;
    reducedPreference.dispatchEvent(new Event('change'));
    expect(section.classList.contains('scroll-scene--active')).toBe(false);
    expect(section.style.getPropertyValue('--scene-progress')).toBe('');
  });

  it('releases scroll work when switching to lightweight mode and restores desktop scenes', async () => {
    lightweight = false;
    const { section } = await render();
    flushFrame();
    expect(section.classList.contains('scroll-scene--active')).toBe(true);
    expect(section.style.getPropertyValue('--scene-progress')).not.toBe('');

    lightweight = true;
    preference.dispatchEvent(new Event('change'));
    expect(section.classList.contains('scroll-scene--active')).toBe(false);
    expect(section.style.getPropertyValue('--scene-progress')).toBe('');
    expect(disconnect).toHaveBeenCalledTimes(2);
    window.dispatchEvent(new Event('scroll'));
    expect(pendingFrames.size).toBe(0);

    lightweight = false;
    preference.dispatchEvent(new Event('change'));
    flushFrame();
    expect(section.classList.contains('scroll-scene--active')).toBe(true);
    expect(section.style.getPropertyValue('--scene-progress')).not.toBe('');
  });

  it('cancels queued frames and removes listeners when navigating away', async () => {
    lightweight = false;
    const { fixture } = await render();
    expect(pendingFrames.size).toBeGreaterThan(0);
    fixture.destroy();
    expect(pendingFrames.size).toBe(0);
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('resize'));
    preference.dispatchEvent(new Event('change'));
    expect(pendingFrames.size).toBe(0);
  });
});
