<script lang="ts" setup>
import PageFooter from './PageFooter.vue';
import PageTitlebar from './PageTitlebar.vue';
defineProps({
  title: { type: String, default: 'Default Text' },
  red33m: { type: Boolean, default: false },
});
</script>

<template>
  <div>
    <PageTitlebar :is-red33m="red33m" :text="title" />
    <h1>
      Content<br />
      Restructure<br />
      Underway
    </h1>
    <PageFooter />
  </div>
</template>

<style scoped>
h1 {
  position: relative;
  font-size: clamp(2rem, 17vw, 5.5rem);
  margin: 0 auto;
  font-weight: 300;
  font-family: Nunito Sans;
  text-align: center;
  color: hsl(50, 100%, 60%);
  text-shadow: 0 0 20px hsl(50, 100%, 60%);
  animation: blink 1s infinite alternate linear;
  animation-timing-function: cubic-bezier(0.58, 0.02, 1, 0.7);
}

@keyframes blink {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0.3;
    transform: scale(0.87);
  }
}
</style>
