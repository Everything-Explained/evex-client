<script lang="ts" setup>
import { computed, reactive } from 'vue';
import PageTitlebar from '@/components/PageTitlebar.vue';
import PageFooter from '@/components/PageFooter.vue';
import FormQna, { FormQuestion } from '@/components/FormQnA.vue';
import UxButton from '@/components/UxButton.vue';
import UxText from '@/components/UxText.vue';
import UxEmbeddedVideo from '@/components/UxEmbeddedVideo.vue';

const questions = [
  {
    text: 'What is your definition of Enlightenment (what does it mean to be Enlightened)?',
  },

  {
    text: 'Do you find the pursuit of Enlightenment to be spiritually beneficial? If so, what \
           benefits can Enlightenment provide to spiritual practitioners and those in their life?',
  },

  {
    text: 'Do you think there are any <strong>cons</strong> to Enlightenment or is it all \
           <strong>pros</strong>?',
  },

  {
    text: 'Do you think the ego should be regarded as real or illusory? Should it be cultivated \
           or unrealized?',
  },

  {
    text: 'Do you think that egoic desires can be good or are they problematic by nature? Does \
           the ego provide any beneficial functions or is it inherently-destructive?',
  },
  {
    text: 'Do you have a deep sense of life purpose? Are you set on a path or career that you’re \
           passionate about?',
  },
  {
    text: 'Do you have any specific altruistic tendencies that frequently crop up in your life? \
           (for nonnative speakers, “altruistic” means selfless or focused on caring for others \
           besides just yourself)',
  },
  {
    text: 'Is your career-orientation aimed more towards finding a job or purpose you enjoy as an \
           end in of itself? Or is it aimed at finding a career that’ll afford you the ability \
           to spend time on the activities you enjoy?',
  },
  {
    text: 'What’s your view on the intellect?',
  },
  {
    text: 'What areas of study interest you the most? (e.g. physics, neuroscience, philosophy, \
          psychology, math, religion etc.) Why do those specific subjects capture your interest?',
  },
  {
    text: 'How do you normally engage people in discussions around your topic(s) of interest? If \
           there’s a disagreement, do you attempt to reach a middle ground or to stand your ground? \
           Can you ever think of situations in which the opposite to your approach is best? \
           (stand-ground instead of middle-ground or vice versa)',
  },
  {
    text: 'Does deep contemplation excite you?',
  },
] as FormQuestion[];
const aptitudes = [
  ' Your understanding of mystical topics, such as Enlightenment for example (but not necessarily how Enlightened or spiritually-inclined you are).',
  ' Your flexibility in entertaining different concepts and your reasons for entertaining them.',
  ' Your mental fortitude (e.g. your ability to engage deeply existential & potentially troubling topics free of detrimental side effects).',
  ' Your religious or spiritual inclinations (regardless of believing in such topics or not).',
  ' Your application of spiritual or religious beliefs, if you hold any.',
];

const titleBarVal = computed(() =>
  formState.isSubmitted ? 'REQUEST SUBMITTED' : 'Exclusive Content Form'
);
const formState = reactive({ isAccepted: false, isSubmitted: false });

const accept = () => setState('isAccepted', true);
const back = () => setState('isAccepted', false);
const submitted = () => setState('isSubmitted', true);

function setState(name: keyof typeof formState, val: boolean) {
  (formState[name] = val), window.scrollTo(0, 0);
}
</script>

<template>
  <div class="red-form">
    <page-titlebar
      :ease-in="350"
      :ease-out="350"
      :text="titleBarVal"
      :class="['red-form__titlebar', { '--submitted': formState.isSubmitted }]"
    />
    <transition name="fade" mode="out-in">
      <div v-if="!formState.isAccepted">
        <div class="ux__page-container">
          <ux-text type="block">
            This form functions as an application for access to EC (exclusive
            content). It is <em>by no means</em> a test for a single specific
            type of personality, intelligence, or level of overall advancement.
            <br /><br />
            <strong
              >Please listen to the following recording. It’s necessary for
              understanding the parameters around this exclusive
              content.:</strong
            >
          </ux-text>
          <br />
          <div class="red-form__yt-container">
            <ux-embedded-video id="0SU7HTREi-4" api="youtube" />
          </div>
          <br />
          <ux-text custom-class="red-form__begin-text" type="block">
            <em>This application is meant to gauge you on the following:</em>
          </ux-text>
          <ux-text
            v-for="(aptitude, i) of aptitudes"
            :key="i"
            custom-class="red-form__list-item"
            type="block"
          >
            <ul>
              <li v-html="aptitude" />
            </ul>
          </ux-text>
          <br />
          <ux-text type="block">
            By clicking the <strong>ACCEPT</strong> button below, you're
            agreeing to take full responsibility for all your (re)actions based
            on the exclusive content, <em>including but not limited to</em>,
            <strong>all risks mentioned above</strong>. You also agree that
            <strong>everything-explained.org</strong> and all associated persons
            are <em>not</em> responsible in any way for your (re)actions based
            on the exclusive content.
          </ux-text>
          <ux-button class="red-form__button" theme="attention" @click="accept">
            ACCEPT AND BEGIN
          </ux-button>
        </div>
        <page-footer />
      </div>

      <div v-else-if="!formState.isSubmitted" class="r3d-form__form">
        <ux-text type="block">
          <strong
            >Please respond to the following questions in an honest
            manner.</strong
          >
          This form will determine if you’re more or less likely to
          <strong>gain value</strong> from the exclusive content. <br /><br />
          <em>Do not</em> enter responses that are intended to make you seem
          more advanced or Enlightened. This isn’t necessarily a test and even
          if you’re very Enlightened, it <strong>doesn’t</strong>
          mean that this content is going to be beneficial to you.
        </ux-text>
        <form-qna
          id="red33m"
          :type="0"
          name-label="Name or Preferred Title"
          :questions="questions"
          :show-back="true"
          :minchars="120"
          :maxchars="500"
          @back="back"
          @submitted="submitted"
        />
        <page-footer />
      </div>

      <div v-else>
        <ux-text custom-class="red-form__submitted-text" type="block">
          <strong
            >Thank you for your interest in this exclusive content.</strong
          >
          Our team will get back to you as soon as possible. Whatever the
          results may be, <em>do not take them personally</em>.<br /><br />

          Ethan is friends with some of the most Enlightened people on the
          planet and has shared this exclusive content with some of them;
          <strong>even they</strong> have not all found it beneficial. Negative
          results should not be taken as a negative reflection on you.
          <br /><br />

          Expect a response <strong>within 7 days</strong>, whether that
          response is to <strong>grant</strong> or <em>reject</em> access to
          this content.
        </ux-text>
        <page-footer />
      </div>
    </transition>
  </div>
</template>
