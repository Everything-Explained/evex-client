<template>
  <app-markdown :simple="false">
    <template v-for="(n, i) of nodes">
      <p
        v-if="'p' == n[0]"
        :key="'p' + i"
        v-html="n[1]"
      />
      <ol
        v-else-if="'ol' == n[0]"
        :key="'ol' + i"
        :start="n[2] || 1"
        v-html="n[1]"
      />
      <span v-else-if="'youtube' == n[0]" :key="'yt' + i">
        <ux-embedded-video
          :id="n[1]"
          api="youtube"
        />
      </span>
      <ux-img
        v-else-if="'img' == n[0]"
        :key="'img' + i"
        :src="n[1]"
        :asset="true"
      />
      <blockquote
        v-else-if="'bq' == n[0]"
        :key="'bq' + i"
        v-html="n[1]"
      />
      <span
        v-else
        :key="'span' + i"
        v-html="n[1]"
      />
    </template>
  </app-markdown>
</template>





<script lang="ts" setup>
import { PropType }          from "vue";
import UxImg                 from "./UxImg.vue";
import AppMarkdown           from "./AppMarkdown.vue";
import { useHTMLNodeParser } from "@/composeables/htmlNodeParser";
import UxEmbeddedVideo from "./UxEmbeddedVideo.vue";


const { html } = defineProps({
  html: { type: String as PropType<string>, required: true },
});
const { getNodesUsingBQ, getNodesUsingP }
              = useHTMLNodeParser(html);
const nodes   = html.includes('<blockquote>') ? getNodesUsingBQ() : getNodesUsingP();

</script>



