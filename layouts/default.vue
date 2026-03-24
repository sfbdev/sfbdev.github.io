<template>
  <div>
    <nav>
      <NuxtLink to="/">home</NuxtLink>
      <NuxtLink to="/blog">blog</NuxtLink>
      <NuxtLink to="/about">about</NuxtLink>
    </nav>
    <slot />
    <footer>
      <p>© {{ new Date().getFullYear() }} sfb.dev</p>
    </footer>
  </div>
</template>
