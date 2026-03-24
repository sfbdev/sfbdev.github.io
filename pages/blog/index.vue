<template>
  <div>
    <h1>blog</h1>
    <ul class="post-list" v-if="posts?.length">
      <li v-for="post in posts" :key="post.path">
        <span class="post-date">{{ formatDate(post.date) }}</span>
        <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
      </li>
    </ul>
    <p v-else>no posts yet.</p>
  </div>
</template>

<script setup>
const { data: posts } = await useAsyncData('all-blog-posts', () =>
  queryCollection('blog').order('date', 'DESC').all()
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
