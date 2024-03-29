<script lang="ts" setup>
import { computed, ref } from 'vue';
import PageTitlebar from '@/components/PageTitlebar.vue';
import PageFooter from '@/components/PageFooter.vue';
import FormQna, { FormQuestion } from '@/components/FormQnA.vue';
import UxButton from '@/components/ux/UxButton.vue';
import UxText from '@/components/ux/UxText.vue';

const _formTypes: FormQuestion[][] = [
  [
    { text: 'What about our organization interests you?' },
    {
      text: 'In what specific ways do you envision yourself contributing to this community?',
      subtext:
        'Feel free to explain any of your talents or skills and how you’d utilize them to the fullest!',
    },
  ],
  [
    { text: 'Which member(s) would you like to collaborate with and why?' },
    { text: 'What does your collaboration require of that/those member(s)?' },
  ],
  [
    {
      text: 'What group, institution, organization, or field of expertise are you speaking on behalf of?',
    },
    { text: 'What specific issue(s) would you like to address?' },
  ],
];

const typeText = ['share content with us', 'collaborate with us', 'correct us'];

const isFormActive = ref(false);
const isSubmitted = ref(false);
const formID = ref('');
const pageTitle = computed(() =>
  isFormActive.value
    ? isSubmitted.value
      ? 'Request Submitted'
      : typeText[formType.value]
    : 'Support'
);
const questions = ref<FormQuestion[]>([]);
const formType = ref(0);

function activateForm(type: number) {
  questions.value = _formTypes[type];
  formType.value = type;
  formID.value = `${type}`;
  isFormActive.value = true;
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 450);
}

function back() {
  isFormActive.value = false;
}
function submitted() {
  isSubmitted.value = true;
}
</script>

<template>
  <div class="support">
    <page-titlebar
      :class="{ '--submitted': isSubmitted }"
      :text="pageTitle"
      :ease-in="350"
      :ease-out="350"
    />
    <transition name="fade" mode="out-in">
      <div v-if="!isFormActive">
        <div class="ux__page-container">
          <ux-text type="block">
            Our team is committed to bringing you top-grade content for
            <b>no cost at all</b>. Furthermore, you - the customer - are granted
            the freedom to help us steer this platform. If there’s
            <em>anything</em> you’d like to see our community accomplish,
            consider giving back to the providers.
          </ux-text>
          <ux-text type="block">
            Donations can contribute to a <b>variety of matters</b> including
            but not limited to: upgraded video-producing equipment; community
            out-reach programs (e.g. spiritual counseling, academic
            collaboration, providing for the underprivileged etc.);
            entrepreneurship; seminars; research; documentaries; podcast
            production; etc...
          </ux-text>
          <ux-text type="block">
            Even if you’d simply like to help our contributors
            <b>make a living</b> through producing more content,
            <em>your support furthers that possibility</em>. If any single one
            of these communal benefits appeals to your vision, then consider
            becoming one of our beloved benefactors!
          </ux-text>
          <ux-text custom-class="support__patreon">
            <span class="md-bold">Support our <b>ORG</b> on</span>
            <a
              href="https://www.patreon.com/user?u=10855808&fan_landing=true"
              target="_blank"
            >
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOwAAAAwCAMAAAAl8WZyAAAAkFBMVEUAAAD/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk3/Qk12xFArAAAAL3RSTlMAOUf2mcjxKLiWIob62stIFI0tG2NWDoB2C+TqXTPPwkDesKujfHBqCAS8nR+ST7Ssu3cAAARFSURBVGje7ZnZmqIwEEaLRRhtEMR9xV1w4/3fblqTIQl/2ib2fN/MBedOqiF1shY0NTQ0NDQ0NDT8XTqWxLJDX9B/xmNSuFpIXkZ9+XIyJSCDm2NCpvfeeeN5s9ZlcCUNCbu1kpVeZV8ozPY26dg8o11ScAtE5NtVrnvpKa+mCTcvoN3rzZPi2zUBIQt9VLPaEeIGRYVzn4Alj6nd1UPXQMieq7HZnRR8uHtIFSZFhf2IR6BPy8Dt+dO5ENJ2oEnH4jHUOnwn6wjZXxg9mMjqHzFPSKXFA3s1K8/VyyIwtjMeCI1kkYGJbL4qdCxBluG/KbsilbW+pX2BKLLItY4sroNAytIZ6WVbtWV3ySfLwUptFa3aJGGPH9xYJD08fhyyiuzs+eD7rmBsUbbXL8lI4lh2/TGJR53htuCkIMtY15XtEWMrekmQiX71cgJY5EjaBRdWUo9BdkJaYhaVHryey0OBspu6smVoXuYkGBaCCE9qZe9HWbUbByA7Ji23gnGX/HlyM5BlnExlD+w+mxgizyCF48tIdgnr4KVs7pQbOK7ytV7WMZWN8Hgfse7seE/n6Zuyo4B1Vk3Zu5iaONwuyPIcfi574ltLiqeHuewWZE+koy2CuJBDkG2FbPWZyR5xaXZ5swf2WFNZVc0F2fOkxIcB6+hLiLh6xV2yeWMmG0JZ0flzJYGj0kQWh8p/VXPMYCuSn2LByPJ559eRvRGjh1XFobyyKY8Kc9kIqoqXRUXm4TTC/VPIrngarTqyl+knI2tX4FIJSxeXpW8mO33gj8syp57s1FC2S7Tnkdu3soHzSVBW2/giZonzNjGRLZwHUG7+eBqj7IjfMa5dG2NKN6E/DdiUryuLjAllw18l64oDbhBpuaWALH2w3Ie1ZbEcm7NpLpXm3tuybdLIHkmHW461TByUpy/KkvdcvW0T2c1ajtvsoi//sN+TnZ1IAYsKLFFD7Xv1BWWle+rLro66F57gtHgwkd6TzWUtMpDNHM24XwuGrZelsJ5sOniwiK5YoiJBVl92/vlYj1cPJrLkYh2cbZT9E2Wtb2UhVZhNwMLsnLVhs63xiteHLXq5Ec2jrGizZgWFnLWyqZks7cTLLMp+jEpy9UjlpItOnsfRhf3iYnrZ/k9k40JP30w2C8qJjLKBYAganPm8EMRaWYb7A9kT30e7f+CNTsxkaaF79fe/+W6chYUOi17IZsH7si3p4JG3gJWRrCgGvNzkU+o0RVVPdkVZOr6SdR04ucAjhBqjSFBWv9w36nrYG8iyokhl28fxUHt//kJ2B/8swK+KPRJceKOQc5sqrPinEsYEfRJtbaySXAIpnt4J2FSK6HvxtZFvR7ZtRwnpWEf2IxiTIGaX1tJkY0/wqcIyUv7Qft54l2+MbJWoT0i8uLRmnjNfbSfaJK1nM1Yl6chO6N8zJVNya/DRbveOUUwNDQ0NDQ0N/xu/AQr874JXA5P+AAAAAElFTkSuQmCC"
                alt=""
              />
            </a>
          </ux-text>
          <ux-text type="block">
            Donations of any amount are <b>highly appreciated</b> and you can
            trust our commitment to create the transformations you’re passionate
            about!
          </ux-text>
          <ux-text type="header"> want to share your own content? </ux-text>
          <ux-text type="block">
            Think you’ve got something of significant value and want to produce
            your own content for the community?
            <b>Click the button below</b> and shoot us a message. We’re excited
            to see what you can bring to the table!
          </ux-text>
          <ux-button
            class="support__button"
            theme="dangerous"
            @click="activateForm(0)"
          >
            {{ typeText[0] }}
          </ux-button>
          <ux-text type="header"> want to collaborate? </ux-text>
          <ux-text type="block">
            Have the urge to collaborate with a member of the team?
            <b>Click the button below</b> and give yourself the chance to make
            it happen!
          </ux-text>
          <ux-button
            class="support__button"
            theme="dangerous"
            @click="activateForm(1)"
          >
            {{ typeText[1] }}
          </ux-button>
          <ux-text type="header"> is something incorrect? </ux-text>
          <ux-text type="block">
            Did you see something posted in an article or video that you felt
            <em>inaccurately</em> represented your organization or area of
            expertise? <b>Click the button below</b> and let us know what we
            need to correct.
          </ux-text>
          <ux-button
            class="support__button"
            theme="dangerous"
            @click="activateForm(2)"
          >
            {{ typeText[2] }}
          </ux-button>
        </div>
        <page-footer />
      </div>
      <div v-else-if="!isSubmitted">
        <div class="support__content">
          <!-- We add 1 to type because Red33m form is 0 -->
          <form-qna
            :id="'support' + formID"
            :questions="questions"
            :type="formType + 1"
            :name-label="'Name or Preferred Title'"
            :show-back="true"
            :minchars="70"
            @back="back"
            @submitted="submitted"
          />
        </div>
        <page-footer />
      </div>
      <div v-else>
        <ux-text custom-class="support__submitted-text" type="block">
          <i>Thank you for your interest in our content!</i>
          <br />
          <br />
          Our team will try to get back to you
          <strong>within 7 days</strong> for our response. If you don't receive
          a message from us within that alloted time, don't worry, it just means
          we have a larger backlog than expected.
        </ux-text>
        <page-footer />
      </div>
    </transition>
  </div>
</template>
