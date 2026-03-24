<template>
  <div>
    <h1>hi, i'm furkan.</h1>
    <p>front-end developer. this is my personal website — i share my projects and writings here.</p>

    <hr>

    <h2>recent posts</h2>
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
const { data: posts } = await useAsyncData('blog-posts', () =>
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
