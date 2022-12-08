<script lang="ts" setup>
import UxEmail from './ux/UxEmail.vue';
</script>

<template>
  <footer ref="footRef" class="pg-footer">
    <span class="pg-footer__version">
      α<sup
        >6<sub
          ><router-link :to="'/changelog/a6--vision'">vision</router-link></sub
        ></sup
      >
      <span class="pipe">|</span>
      <sup>
        <sub>
          <ux-email
            class="email"
            name="jason"
            subject="EvEx - Website Feedback"
            text="Site Feedback"
          />
        </sub>
      </sup>
    </span>
    <span class="pg-footer__copyright">
      <span>Copyright &#169; 2020 - 2022</span><br />
      <span>Everything Explained, Some Rights Reserved</span> <br />
      <a
        rel="license"
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
        target="_blank"
        >Creative Commons BY-NC-SA-4.0 License</a
      ><br />
    </span>
  </footer>
</template>
