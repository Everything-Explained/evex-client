

<script lang='ts' setup>
import PageTitlebar from '@/components/PageTitlebar.vue';
import PageFooter from '@/components/PageFooter.vue';
</script>





<template>
  <div class="http-error__container">
    <page-titlebar>
      <span class="http-error__bad-color">
        Suspicious Activity
      </span>
    </page-titlebar>
    <h1 class="http-error__h1 code401">
      You are not authorized to view this content.
    </h1>
    <div class="http-error__disclaimer">
      Please do not attempt to circumvent our authentication systems!!
    </div>
    <page-footer />
  </div>
</template>