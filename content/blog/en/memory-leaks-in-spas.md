---
title: "Memory Leaks in Single-Page Applications: Detection, Patterns, and Prevention"
date: 2026-03-22
description: "The five most common SPA memory leak patterns and how to find them with Chrome DevTools."
---

SPAs don't get page reloads to clean up after themselves. Every navigation stays in the same process. Over time, memory leaks accumulate until the tab consumes gigabytes and the browser kills it — or worse, it silently degrades performance until users abandon the app.

Most memory leaks in SPAs fall into a handful of patterns. Knowing them means you can prevent them by design.

## Pattern 1: Detached DOM Trees

You remove an element from the DOM but something still references it — an event listener closure, a variable in a module scope, a cache object. The element and its entire subtree stay in memory. This is the most common leak in component-based frameworks. The fix: always clean up references in teardown hooks (`onUnmounted` in Vue, `useEffect` cleanup in React).

## Pattern 2: Forgotten Event Listeners and Observers

Adding `addEventListener` to `window`, `document`, or any element outside the component's own tree without removing it on unmount. Same for `IntersectionObserver`, `ResizeObserver`, `MutationObserver`, WebSocket handlers, and `setInterval`. Each holds a reference to its callback closure, which holds references to everything in its scope chain.

```javascript
// Vue 3 pattern — proper cleanup
import { onMounted, onUnmounted } from 'vue'

export function useWindowResize(callback) {
  const handler = () => callback(window.innerWidth, window.innerHeight)

  onMounted(() => window.addEventListener('resize', handler))
  onUnmounted(() => window.removeEventListener('resize', handler))
}
```

## Pattern 3: Closures Capturing Component Scope

An async operation (API call, setTimeout, animation frame loop) holds a closure that references the component's reactive state or DOM refs. If the component unmounts before the async operation completes, the closure keeps the dead component's entire scope alive. Use `AbortController` for fetch requests and track mounted state for other async work.

## Pattern 4: Global Stores Accumulating Stale Data

Pinia, Vuex, Redux — if your store grows unboundedly with every navigation (caching every fetched entity, appending to arrays, storing route-specific data), it's a leak. Implement eviction strategies: LRU caches with size limits, cleanup actions on route leave, or `WeakRef`-based caches that let the GC reclaim entries.

## Pattern 5: Third-Party Libraries

Map libraries (Leaflet, Mapbox), chart libraries (Chart.js, D3), rich text editors — many allocate internal state that isn't freed by simply removing the DOM element. Call their explicit destroy/dispose methods.

## Detection Workflow

Open Chrome DevTools → Memory tab → take a heap snapshot. Navigate around your app. Take another snapshot. Use the "Comparison" view to see what allocated between snapshots. Filter by "Detached" to find DOM nodes that should have been collected. The "Retainers" panel shows you the reference chain keeping an object alive — this is where you find the actual leak.

For systematic monitoring, use `performance.measureUserAgentSpecificMemory()` (origin-trial/COOP required) to track `jsHeapUsedSize` over time. Plot it. A healthy SPA's memory should plateau; a leaky one trends upward.

## WeakRef and FinalizationRegistry

`WeakRef` and `FinalizationRegistry` are modern tools for building cache patterns that don't prevent garbage collection. `WeakRef` holds a reference that doesn't prevent GC; `FinalizationRegistry` lets you run cleanup code when an object is collected. Use them for caches where reclamation is acceptable — never for critical state.

Memory management isn't glamorous, but it separates production-grade SPAs from demos that break after 20 minutes of use.
