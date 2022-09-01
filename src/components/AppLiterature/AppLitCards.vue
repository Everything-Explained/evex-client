

<script lang='ts' setup>
import { PropType } from 'vue';
import { useDate } from "@/composeables/date";
import { isEthan } from "@/composeables/globals";
import UxBullet from '../UxBullet.vue';
import UxIcon from '../UxIcon.vue';
import { useURI } from '@/composeables/URI';


interface LitCard {
  title   : string;
  summary : string;
  author  : string;
  date    : string;
}


const {expanded} = defineProps({
  cards        : { type: Array as PropType<LitCard[]>, required: true },
  expanded     : { type: Boolean, default: false },
  showAuthor   : { type: Boolean, default: true  },
  goTo         : { type: Function, required: true },
});

const showFullDate = expanded;
const toURI = useURI;

</script>





<template>
  <div :class="['lit__cards', { '--expanded': expanded }]">
    <div
      v-for="(card, i) of cards"
      :key="i"
      :class="['lit__card', { '--expanded': expanded }]"
    >
      <header @click="goTo(toURI(card.title))">
        {{ card.title }}
      </header>
      <summary>
        {{ card.summary }}
        <footer>
          <span v-if="showAuthor" class="lit-card__author">
            <span
              :class="[
                { '--is-ethan': isEthan(card.author) }
              ]"
            >{{ card.author.trim() }}</span>
            <ux-icon type="user" />
          </span>
          <span class="lit-card__timestamp">
            <span>
              {{
                showFullDate
                  ? useDate(card.date).toFullDateTime()
                  : useDate(card.date).toQuickRelativeTime()
              }}
            </span>
            <ux-icon type="clock" />
          </span>
        </footer>
      </summary>
    </div>
  </div>
</template>








