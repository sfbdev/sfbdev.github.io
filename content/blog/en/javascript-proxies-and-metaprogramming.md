---
title: "JavaScript Proxies and Metaprogramming: Building Reactive Systems from Scratch"
date: 2026-03-23
description: "How Proxy powers Vue 3's reactivity — and what you can build with it yourself."
---

Most frontend developers use reactivity every day through Vue, Solid, or MobX — but few understand what actually powers it under the hood. The answer, in modern JavaScript, is almost always `Proxy`.

A `Proxy` wraps an object and intercepts fundamental operations — property access, assignment, deletion, enumeration, function invocation — through a handler object with traps. This is metaprogramming: code that operates on other code's behavior at runtime.

```javascript
const handler = {
  get(target, prop, receiver) {
    track(target, prop)
    const value = Reflect.get(target, prop, receiver)
    return typeof value === 'object' && value !== null
      ? new Proxy(value, handler)
      : value
  },
  set(target, prop, value, receiver) {
    const oldValue = target[prop]
    const result = Reflect.set(target, prop, value, receiver)
    if (oldValue !== value) trigger(target, prop)
    return result
  }
}
```

This is a simplified version of what Vue 3's `reactive()` does internally. The `get` trap tracks which properties are accessed during a computation (dependency tracking), and the `set` trap triggers re-execution of dependent effects when values change. The recursive proxying in `get` — wrapping nested objects lazily — is how deep reactivity works without walking the entire object tree upfront.

## Why Proxy over Object.defineProperty?

Vue 2 used `defineProperty`, which requires knowing property names at initialization time. This meant Vue 2 couldn't detect property additions or deletions, and couldn't observe array index mutations natively. `Proxy` intercepts operations on the object itself, not individual properties, solving all of these limitations.

## The Reflect Connection

You'll notice `Reflect.get` and `Reflect.set` instead of direct property access. `Reflect` methods mirror `Proxy` traps one-to-one and correctly handle `receiver` — which matters when proxied objects are used as prototypes. Skipping `Reflect` and using `target[prop]` directly breaks prototype chain delegation and causes subtle bugs in inherited reactive objects.

## Practical Applications Beyond Frameworks

**Validation layers** — intercept `set` to enforce schemas at runtime without modifying consuming code.

**Lazy loading** — intercept `get` to fetch data on first access and cache it transparently.

**Change tracking** — accumulate a diff log of mutations for undo/redo systems or CRDT-based sync.

**API clients** — build a proxy where any property access chain like `api.users.byId(3).posts` constructs a URL path dynamically.

## Limitations to Know

Proxies have a performance cost. Each trapped operation adds overhead. For hot paths with thousands of operations per frame, this matters. Some built-in objects (`Map`, `Set`, `Date`) have internal slots that Proxies can't intercept — you need to wrap their methods explicitly. And `Proxy` is not polyfillable; there's no ES5 equivalent.

Understanding Proxies gives you X-ray vision into how modern frameworks work and opens up powerful patterns for your own abstractions.
