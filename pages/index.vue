<template>
  <div>
    <h1>{{ $t('home.greeting') }}</h1>
    <p>{{ $t('home.intro') }}</p>

    <hr>

    <h2>{{ $t('home.recentPosts') }}</h2>
    <ul class="post-list" v-if="posts?.length">
      <li v-for="post in posts" :key="post.path">
        <span class="post-date">{{ formatDate(post.date) }}</span>
        <NuxtLink :to="postUrl(post)">{{ post.title }}</NuxtLink>
      </li>
    </ul>
    <p v-else>{{ $t('home.noPosts') }}</p>
  </div>
</template>

<script setup>
const { locale } = useI18n()
const localePath = useLocalePath()

const collection = computed(() => locale.value === 'tr' ? 'blog_tr' : 'blog_en')

const { data: posts } = await useAsyncData(`blog-posts-${locale.value}`, () =>
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
