<template>
  <div :class="['lit__cards', { '--expanded': expanded }]">
    <div v-for="(card, i) of cards"
         :key="i"
         :class="['lit__card', { '--expanded': expanded }]"
    >
      <header @click="goTo(card.uri)">
        {{ card.title }}
      </header>
      <summary>{{ card.summary }}</summary>
      <footer>
        <span v-if="showAuthor" class="lit-card__author">
          <ux-icon type="user" />
          <span
            :class="[
              'lit-card__author-text',
              { '--is-ethan': isEthan(card.author) }
            ]"
          >{{ card.author }}</span>
        </span>
        <span class="lit-card__timestamp">
          <span v-if="showFullDate" class="lit-card__full-datetime">
            <span class="lit-card__date">
              {{ useDate(card.date).toShortDate() }}
            </span>
            <span class="lit-card__time">
              <ux-bullet />
              {{ useDate(card.date).to12HourTime() }}
            </span>
          </span>
          <span v-else class="lit-card__relative-time">
            <ux-bullet />
            {{ useDate(card.date).toRelativeTime() }}
          </span>
        </span>
      </footer>
    </div>
  </div>
</template>





<script lang='ts' setup>
import { defineProps, PropType } from 'vue';
import { useDate } from "@/composeables/date";
import { isEthan } from "@/composeables/globals";
import UxBullet from '../UxBullet.vue';
import UxIcon from '../UxIcon.vue';


interface LitCard {
  title   : string;
  summary : string;
  author  : string;
  uri     : string;
  date    : string;
}


const {expanded} = defineProps({
  cards        : { type: Array as PropType<LitCard[]>, required: true },
  expanded     : { type: Boolean, default: false },
  showAuthor   : { type: Boolean, default: true  },
  goTo         : { type: Function, required: true },
});

const showFullDate = expanded;

</script>


