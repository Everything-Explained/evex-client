<template>
  <div class="qnaf ee__page-content">
    <div class="qnaf__form">
      <ux-input
        v-model="name"
        class="qnaf__input"
        :minchars="3"
        :maxchars="20"
        :validate="validateInput"
        :regex="nameRegex"
        :tally="true"
        :errmsg="'<em>Special characters</em> are not allowed'"
      >
        {{ nameLabel }}
      </ux-input>
      <br>

      <ux-input
        v-model="email"
        class="qnaf__input"
        type="email"
        :validate="validateInput"
      >
        E-Mail
      </ux-input>
      <br>

      <div
        v-for="(q, i) of questionRefs"
        :key="i"
        class="qnaf__q-block"
      >
        <div class="qnaf__q-container">
          <span
            :data-num="i + 1 + '⁍'"
            class="qnaf__q md"
            v-html="q.text"
          />
          <br>
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
          :validate="validateInput"
        />
      </div>
      <div class="qnaf__controls">
        <ux-button
          v-if="showBack"
          class="qnaf__back-button"
          type="neutral"
          @click="$emit('back')"
        >
          BACK
        </ux-button>
        <ux-button
          :theme="'attention'"
          :disabled="!areInputsValidated"
          :loading="isSubmitting"
          @click="submit"
        >
          SUBMIT
        </ux-button>
        <ux-text v-if="remainingInputs > 0" class="qnaf__validation-text">
          <strong>{{ remainingInputs }}</strong> field(s) require(s) attention
        </ux-text>
        <form-error
          v-else
          class="qnaf__error-text"
          :update="errorUpdate"
          :text="errorText"
        />
      </div>
    </div>
  </div>
</template>


<script lang='ts'>
import { defineComponent, PropType, reactive, toRefs } from "@vue/runtime-core";
import useInputValidation from "@/composeables/inputValidation";
import { APIErrorResp, useAPI }         from "@/services/api_internal";
import uxButtonVue        from "./UxButton.vue";
import FormErrorVue     from "./FormSubmitError.vue";
import uxInputVue         from "./UxInput.vue";
import uxTextVue          from "./UxText.vue";
import { DataCacheArrayKeys, useDateCache } from "@/state/cache-state";


export type FormQuestion = { text: string; subtext?: string; answer?: string; }

interface ReactiveQuestion {
  answer   : string;
  text     : string;
  subtext? : string;
}


export default defineComponent({
  components: {
    'ux-text'       : uxTextVue,
    'ux-input'      : uxInputVue,
    'ux-button'     : uxButtonVue,
    'form-error'    : FormErrorVue,
  },
  props: {
    id        : { type: String  as PropType<DataCacheArrayKeys>,         required: true       },
    type      : { type: Number  as PropType<number>,         required: true       },
    questions : { type: Array   as PropType<FormQuestion[]>, default: () => []    },
    nameLabel : { type: String  as PropType<string>,         default: 'Your Name' },
    showBack  : { type: Boolean as PropType<boolean>,        default: false       },
    minchars  : { type: Number  as PropType<number>,         default: 100         },
    maxchars  : { type: Number  as PropType<number>,         default: 500         },
  },
  emits: ['back', 'submitted'],
  setup(props, ctx) {
    const api             = useAPI();
    const cache           = useDateCache<ReactiveQuestion>();
    const nameRegex       = /^[a-z\s.]+$/i;
    const oldQuestions    = cache.getArrayData(props.id).value;
    const questions       = oldQuestions.length ? oldQuestions : getReactiveQuestions();
    const inputValidation = useInputValidation(2 + props.questions.length);
    const formData        = reactive({ name: '', email: '', });
    const formState       = reactive({ errorUpdate: 0, errorText: '' });

    if (!props.questions.length) throw Error('qnaform::Missing Questions');
    if (!oldQuestions.length) cache.setArrayData(props.id, questions);

    function submit() {
      const qData = {
        ...formData,
        type: props.type,
        questions: questions.map(q => ({ text: q.text, answer: q.answer }))
      };
      api
        .post('/form/qna', qData)
        .then(() => {
          // Clear answers in cache
          cache.setArrayData(props.id, getReactiveQuestions());
          ctx.emit('submitted');
        })
        .catch(setFormError)
      ;
    }

    function getReactiveQuestions() {
      return props.questions.map(q => reactive({ ...q, answer: q.answer || ''}));
    }

    function setFormError(err: APIErrorResp) {
      formState.errorUpdate = Date.now();
      formState.errorText = err.message;
    }

    return {
      ...toRefs(formData),
      ...toRefs(formState),
      validateInput: inputValidation.validate,
      remainingInputs: inputValidation.remaining,
      areInputsValidated: inputValidation.isValidated,
      questionRefs: questions,
      isSubmitting: api.isPending,
      submit,
      nameRegex,
    };
  }
});

</script>


