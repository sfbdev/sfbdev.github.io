<template>
  <div>
    <h1>{{ $t('about.title') }}</h1>
    <p>{{ $t('about.bio1') }}</p>
    <p>{{ $t('about.bio2') }}</p>
    <p>{{ $t('about.bio3') }}</p>
    <p>{{ $t('about.bio4') }}</p>

    <hr>

    <h2>{{ $t('about.contact') }}</h2>
    <ul>
      <li><a href="mailto:hello@sfb.dev">hello@sfb.dev</a></li>
      <li><a href="https://github.com/sfbdev" target="_blank">github</a></li>
      <li><a href="https://linkedin.com/in/sfbdev" target="_blank">linkedin</a></li>
      <li><a href="/cv.pdf" target="_blank">cv (pdf)</a></li>
    </ul>
  </div>
</template>
