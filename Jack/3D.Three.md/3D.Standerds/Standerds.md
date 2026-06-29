## 2. Coding Standards to Maintain

If you want your Angular + Three.js app to be production-ready and performant, follow these rules:

* **Always use `NgZone.runOutsideAngular()` for the animation loop:** Three.js updates the screen 60+ times per second (`requestAnimationFrame`). If you don't run it outside Angular's zone, Angular will try to check the entire app for UI updates 60 times a second, which will severely lag your application.
* **Always Dispose of Resources (`ngOnDestroy`):** WebGL handles memory differently than regular JavaScript. If you route away from your 3D page without calling `.dispose()` on your geometries, materials, and textures, that data stays stuck in the graphics card memory (GPU), eventually crashing the user's browser tab.
* **Handle Window Resizing Gracefully:** 3D scenes look stretched if the window changes size. Add a listener to update the camera aspect ratio and renderer size when the browser is resized.
* **Keep Canvas CSS clean:** Give your `<canvas>` element `display: block; width: 100%; height: 100%;` so it scales cleanly with its parent Angular container.


## 1. Why use `ngZone.runOutsideAngular(...)`? (Performance)

By default, Angular uses a tool called **Zone.js** to listen to every asynchronous event (clicks, timers, HTTP requests, animation frames). Whenever an event happens, Angular automatically runs "Change Detection" to see if it needs to update the HTML.

Three.js relies on `requestAnimationFrame`, which executes your `render()` function **60 times per second** (or more depending on the monitor's refresh rate) to animate the 3D scene.

* **Without `runOutsideAngular`:** Angular would intercept every single frame and scan your entire application for UI changes 60 times every second. This causes massive CPU lag, stuttering frame rates, and can quickly freeze the browser.
* **With `runOutsideAngular`:** You are telling Angular: *"Hey, ignore everything happening inside this function. Do not trigger change detection."* This keeps your 3D physics and rendering running at a buttery-smooth 60+ FPS without putting any stress on Angular.


That block of code handles two incredibly important things in an Angular application: **performance optimization** and **timing safety**.
---

## 2. Why check `document.readyState`? (Timing Safety)

Angular's `ngAfterViewInit` lifecycle hook fires as soon as the component's HTML is ready, but in some edge cases (or complex routing setups), the browser's global `document` object might still be parsing or loading other heavy assets.

If Three.js tries to initialize, calculate dimensions, or bind to a canvas before the browser is fully ready, it can throw errors or result in a broken, incorrectly sized 3D canvas.

```typescript
if (document.readyState !== 'loading') {
  // Option A: The DOM is already fully loaded and parsed. 
  // We can safely start rendering immediately.
  this.render();
} else {
  // Option B: The browser is still busy loading the initial document.
  // Wait until it's completely finished (DOMContentLoaded) before firing the loop.
  window.addEventListener('DOMContentLoaded', () => this.render());
}

```

### Summary

In short, this code ensures that your 3D scene **waits for the browser to be completely ready** before starting, and once it does start, it **runs at maximum performance** without choking Angular's UI loop.