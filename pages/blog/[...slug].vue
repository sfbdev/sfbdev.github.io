<template>
  <article v-if="post">
    <h1>{{ post.title }}</h1>
    <p class="post-date">{{ formatDate(post.date) }}</p>
    <hr>
    <ContentRenderer :value="post" />
  </article>
</template>

<script setup>
const route = useRoute()
const { data: post } = await useAsyncData(`blog-${route.path}`, () =>
  queryCollection('blog').path(route.path).first()
)

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>
