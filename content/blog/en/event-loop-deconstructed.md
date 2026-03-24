---
title: "The Event Loop Deconstructed: Microtasks, Macrotasks, and Why Your Async Code Breaks"
date: 2026-03-24
description: "A deep dive into JavaScript's event loop priority system — microtasks, macrotasks, and real-world consequences."
---

You know JavaScript is single-threaded. You know about the event loop. But do you know why `Promise.resolve().then(fn)` fires before `setTimeout(fn, 0)`? And can you predict the exact execution order of a block mixing `queueMicrotask`, `MutationObserver`, `requestAnimationFrame`, and `setTimeout`?

The event loop is not a single queue — it's a system of multiple queues with strict priority rules.

**Macrotask queue** (sometimes called the task queue): `setTimeout`, `setInterval`, `setImmediate` (Node), I/O callbacks, UI rendering events. One macrotask is processed per event loop iteration.

**Microtask queue**: `Promise.then/catch/finally`, `queueMicrotask`, `MutationObserver`. After each macrotask completes and the call stack empties, the **entire** microtask queue is drained before the next macrotask runs — including microtasks enqueued during microtask processing.

This has real consequences:

```javascript
console.log('1')

setTimeout(() => console.log('2'), 0)

Promise.resolve()
  .then(() => {
    console.log('3')
    queueMicrotask(() => console.log('4'))
  })
  .then(() => console.log('5'))

queueMicrotask(() => console.log('6'))

console.log('7')
```

Output: `1, 7, 3, 6, 5, 4, 2`

The synchronous code runs first (1, 7). Then the microtask queue drains: the first `.then` fires (3), `queueMicrotask` from inside it enqueues (4), the standalone microtask fires (6), the chained `.then` fires (5), then (4) — all before `setTimeout`'s macrotask (2) gets a turn.

## Where This Bites You in Practice

**Infinite microtask loops.** If a microtask keeps enqueuing more microtasks, the macrotask queue starves. The UI freezes. No repaint happens. Unlike `setTimeout` recursion, recursive microtasks never yield to the browser.

**requestAnimationFrame timing.** rAF callbacks run before the browser paints, after microtasks, as part of the rendering pipeline — not as a macrotask. Chaining `rAF` inside `rAF` schedules to the *next* frame, not the current one. Knowing this is critical for animation sequencing.

**Vue's nextTick.** Vue batches DOM updates and flushes them asynchronously. `nextTick` used to use `MutationObserver` as a microtask hack, then switched to `Promise.then`. Understanding this explains why `nextTick` runs before `setTimeout` and why you can reliably read updated DOM in a `nextTick` callback.

## Node.js Adds Complexity

Node has `process.nextTick` (fires before Promise microtasks — yes, it has *higher* priority than `.then`), `setImmediate` (fires in the check phase, after I/O), and libuv's event loop phases (timers → pending → idle → poll → check → close). Browser and Node event loops are not the same.

Mastering the event loop means you stop guessing about async timing and start reasoning about it.
