<script lang="ts" setup>
import AppLiterature, {
  AppLitOptions,
} from '@/components/AppLiterature/AppLiterature.vue';
import { useAPI } from '@/services/api_internal';
const options: AppLitOptions = {
  uri: 'literature/public',
  title: 'Literature',
  version: useAPI().state?.versions?.pubLit.v,
};
</script>

<template><app-literature :options="options" /></template>
