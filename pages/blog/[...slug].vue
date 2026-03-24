<template>
  <article v-if="post">
    <h1>{{ post.title }}</h1>
    <p class="post-date">{{ formatDate(post.date) }}</p>
    <hr>
    <ContentRenderer :value="post" />
  </article>
</template>

<script setup>
const { locale } = useI18n()
const route = useRoute()

const slug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug
const contentPath = `/blog/${locale.value}/${slug}`
const collection = computed(() => locale.value === 'tr' ? 'blog_tr' : 'blog_en')

const { data: post } = await useAsyncData(`blog-${contentPath}`, () =>
  queryCollection(collection.value).path(contentPath).first()
)

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString(locale.value === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>
