<script lang="ts" setup>
import { PropType } from 'vue';
import { useDate } from '@/composeables/date';
import { isEthan } from '@/composeables/globals';
import UxIcon from '../UxIcon.vue';

interface LitCard {
  title: string;
  summary: string;
  author: string;
  date: string;
}

defineProps({
  cards: { type: Array as PropType<LitCard[]>, required: true },
  showFullDate: { type: Boolean, default: false },
  showAuthor: { type: Boolean, default: true },
  goTo: { type: Function, required: true },
});
</script>

<template>
  <div :class="['lit__cards', { '--expanded': showFullDate }]">
    <div
      v-for="(card, i) of cards"
      :key="i"
      :class="['lit__card', { '--expanded': showFullDate }]"
    >
      <header @click="goTo(card.title)">
        {{ card.title }}
      </header>
      <summary>
        {{ card.summary }}
        <footer>
          <span v-if="showAuthor" class="lit-card__author">
            <span>{{ card.author.trim() }}</span>
            <ux-icon
              :class="['author__icon', { '--is-ethan': isEthan(card.author) }]"
              type="user"
            />
          </span>
          <span class="lit-card__timestamp">
            <span>
              {{
                showFullDate
                  ? useDate(card.date).toFullDateTime()
                  : useDate(card.date).toHybridTime()
              }}
            </span>
            <ux-icon type="clock" />
          </span>
        </footer>
      </summary>
    </div>
  </div>
</template>
