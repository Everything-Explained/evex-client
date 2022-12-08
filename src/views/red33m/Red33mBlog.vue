<script lang="ts" setup>
import AppLiterature, {
  AppLitOptions,
} from '@/components/AppLiterature/AppLiterature.vue';
import { useAPI } from '@/services/api_internal';

const options: AppLitOptions = {
  uri: 'blog/red33m',
  title: 'RED33M Blog',
  expanded: true,
  reverseOrder: true,
  isRed33m: true,
  version: useAPI().state.versions?.r3dBlog.v,
};
</script>

<template>
  <div class="r3d-blog">
    <app-literature :options="options" />
  </div>
</template>
