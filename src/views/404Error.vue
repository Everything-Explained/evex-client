

<script lang='ts' setup>
import PageTitlebar from '@/components/PageTitlebar.vue';
import PageFooter from '@/components/PageFooter.vue';
</script>





<template>
  <div class="http-error__container">
    <page-titlebar>Page Not Found</page-titlebar>
    <h1 class="http-error__h1">
      <span class="http-error__fail-color">Oops</span>, is there
      <span class="http-error__info-color">supposed</span> to be a page here?
    </h1>
    <page-footer />
  </div>
</template>







