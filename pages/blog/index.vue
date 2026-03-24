<template>
  <div>
    <h1>{{ $t('blog.title') }}</h1>
    <ul class="post-list" v-if="posts?.length">
      <li v-for="post in posts" :key="post.path">
        <span class="post-date">{{ formatDate(post.date) }}</span>
        <NuxtLink :to="postUrl(post)">{{ post.title }}</NuxtLink>
      </li>
    </ul>
    <p v-else>{{ $t('blog.noPosts') }}</p>
  </div>
</template>

<script setup>
const { locale } = useI18n()
const localePath = useLocalePath()

const collection = computed(() => locale.value === 'tr' ? 'blog_tr' : 'blog_en')

const { data: posts } = await useAsyncData(`all-blog-posts-${locale.value}`, () =>
  queryCollection(collection.value).order('date', 'DESC').all()
)

function postUrl(post) {
  const clean = post.path.replace(/\/blog\/(en|tr)\//, '/blog/')
  return localePath(clean)
}

function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString(locale.value === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>
