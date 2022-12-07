<script lang="ts" setup>
import AppLiterature, {
  AppLitOptions,
} from '@/components/AppLiterature/AppLiterature.vue';
import { useAPI } from '@/services/api_internal';

const options: AppLitOptions = {
  uri: 'blog/public',
  title: 'Blog Entries',
  expanded: true,
  reverseOrder: true,
  version: useAPI().state.versions?.pubBlog.v,
};
</script>

<template>
  <app-literature :options="options" />
</template>
