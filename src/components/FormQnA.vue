<script lang="ts" setup>
import { PropType, reactive } from 'vue';
import useInputValidation from '@/composeables/inputValidation';
import { useAPI } from '@/services/api_internal';
import { useDataCache } from '@/state/cache-state';
import UxButton from './UxButton.vue';
import FormError from './FormError.vue';
import UxInput from './UxInput.vue';
import UxText from './UxText.vue';

export type FormQuestion = { text: string; subtext?: string; answer?: string };

interface ReactiveQuestions {
  [key: string]:
    | {
        answer: string;
        text: string;
        subtext?: string;
      }[]
    | undefined;
}

const props = defineProps({
  id: { type: String as PropType<string>, required: true },
  type: { type: Number as PropType<number>, required: true },
  questions: { type: Array as PropType<FormQuestion[]>, default: () => [] },
  nameLabel: { type: String as PropType<string>, default: 'Your Name' },
  showBack: { type: Boolean as PropType<boolean>, default: false },
  minchars: { type: Number as PropType<number>, default: 100 },
  maxchars: { type: Number as PropType<number>, default: 500 },
});
const emit = defineEmits(['back', 'submitted']);
const api = useAPI();
const cache = useDataCache<ReactiveQuestions>();
const nameRegex = /^[a-z\s.]+$/i;
const formID = `qna/${props.id}`;
const qnaCacheObj = cache.getArrayData('qnaform').value[0] || {};
const oldQuestions = qnaCacheObj[formID];
const questions = oldQuestions ?? getReactiveQuestions();
const formData = reactive({ name: '', email: '' });
const formState = reactive({ errorUpdate: 0, errorText: '' });

if (!props.questions.length) throw Error('<form-qna>::Missing Questions');
if (!oldQuestions) {
  qnaCacheObj[formID] = questions;
  cache.setArrayData('qnaform', [qnaCacheObj]);
}

const { remaining, validate, isValidated } = useInputValidation(
  2 + props.questions.length
);
const isSubmitting = api.isPending;

function submit() {
  const qData = {
    ...formData,
    type: props.type,
    questions: questions.map((q) => ({ text: q.text, answer: q.answer })),
  };
  api
    .post('/form/qna', qData)
    .then(() => {
      qnaCacheObj[formID] = getReactiveQuestions();
      // Clear answers in cache
      cache.setArrayData('qnaform', [qnaCacheObj]);
      emit('submitted');
    })
    .catch(setFormError);
}

function getReactiveQuestions() {
  return props.questions.map((q) => reactive({ ...q, answer: q.answer || '' }));
}

function setFormError(err: { status: string; data: any }) {
  formState.errorUpdate = Date.now();
  formState.errorText = `FATAL ERROR: ${err.data.message}`;
}
</script>

<template>
  <div class="qnaf ux__page-container">
    <div class="qnaf__form">
      <ux-input
        v-model="formData.name"
        class="qnaf__input"
        :minchars="3"
        :maxchars="20"
        :validate="validate"
        :regex="nameRegex"
        :tally="true"
        :errmsg="'<em>Special characters</em> are not allowed'"
      >
        {{ nameLabel }}
      </ux-input>
      <br />

      <ux-input
        v-model="formData.email"
        class="qnaf__input"
        type="email"
        :validate="validate"
      >
        E-Mail
      </ux-input>
      <br />

      <div v-for="(q, i) of questions" :key="i" class="qnaf__q-block">
        <div class="qnaf__q-container">
          <span :data-num="i + 1 + '⁍'" class="qnaf__q md" v-html="q.text" />
          <br />
          <div v-if="q.subtext" class="qnaf__subtext">
            {{ q.subtext }}
          </div>
        </div>
        <ux-input
          v-model="q.answer"
          type="area"
          class="qnaf__area-input"
          :minchars="minchars"
          :maxchars="maxchars"
          :placeholder="'Answer here...'"
          :validate="validate"
        />
      </div>
      <div class="qnaf__controls">
        <ux-button
          v-if="showBack"
          class="qnaf__back-button"
          theme="neutral"
          @click="$emit('back')"
        >
          BACK
        </ux-button>
        <ux-button
          theme="attention"
          :disabled="!isValidated"
          :loading="isSubmitting"
          @click="submit"
        >
          SUBMIT
        </ux-button>
        <ux-text v-if="remaining > 0" custom-class="qnaf__validation-text">
          <strong>{{ remaining }}</strong> field(s) require(s) attention
        </ux-text>
        <form-error
          v-else
          custom-class="qnaf__error-text"
          :update="formState.errorUpdate"
          :text="formState.errorText"
        />
      </div>
    </div>
  </div>
</template>
