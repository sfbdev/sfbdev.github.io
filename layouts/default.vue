<template>
  <div>
    <nav>
      <NuxtLink :to="localePath('/')">{{ $t('nav.home') }}</NuxtLink>
      <NuxtLink :to="localePath('/blog')">{{ $t('nav.blog') }}</NuxtLink>
      <NuxtLink :to="localePath('/about')">{{ $t('nav.about') }}</NuxtLink>
      <!-- <a
        v-for="loc in otherLocales"
        :key="loc.code"
        :href="switchLocalePath(loc.code)"
        class="lang-switch"
      >{{ loc.code }}</a> -->
    </nav>
    <slot />
    <footer>
      <p>{{ $t('footer', { year: new Date().getFullYear() }) }}</p>
    </footer>
  </div>
</template>

<script setup>
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()

const otherLocales = computed(() =>
  locales.value.filter(l => typeof l === 'object' && l.code !== locale.value)
)
</script>
