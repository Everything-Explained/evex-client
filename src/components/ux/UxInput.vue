<script lang="ts" setup>
import useUniqueIDGen from '@/composeables/uniqueID';
import { computed, onMounted, PropType, ref, watch } from 'vue';

type ValidateFn = (val: boolean, id: string) => void;

const _inputTypes = ['text', 'area', 'email', 'password'];

const props = defineProps({
  name: { type: String, default: '' },
  type: { type: String, default: 'text' },
  minchars: { type: Number, default: 0 },
  maxchars: { type: Number, default: 255 },
  tally: { type: Boolean, default: false },
  regex: { type: RegExp, default: /.*/ },
  errmsg: { type: String, default: '<b>Invalid</b>' },
  placeholder: { type: String, default: '' },
  modelValue: { type: String, default: '' },
  validate: { type: Function as PropType<ValidateFn>, default: () => false },
});
const emit = defineEmits(['update:modelValue']);

const id = useUniqueIDGen().genID();
const charLength = ref(0);
const areaText = ref<HTMLTextAreaElement>();
const isTextField = props.type == 'text' || props.type == 'email';
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const workingRegex = props.type == 'email' ? emailRegex : props.regex;
const hasValidInput = computed(() => workingRegex.test(props.modelValue));
const errorMessage = computed(() =>
  props.type == 'email' ? 'Enter a <em>valid</em> E-mail' : props.errmsg
);
const charsRequired = computed(() => props.minchars - charLength.value);
const showCharLimit = computed(
  () => charLength.value > 0 && charsRequired.value > 0
);
const showCharTally = computed(() => charLength.value > 0);
const charLimitReached = computed(() => charsRequired.value <= 0);
const charLengthReached = computed(() => charLength.value == props.maxchars);
const isValidated = computed(
  () => charLimitReached.value && hasValidInput.value
);

if (props.maxchars > 255 && isTextField)
  throw Error('ux-input:: text input has a 255 character max-limit.');
if (!_inputTypes.includes(props.type))
  throw Error('ux-input::invalid input type');

watch(() => isValidated.value, onValidation);
onMounted(detectCachedTextArea);

function onValidation(state: boolean) {
  props.validate(state, id);
}

function detectCachedTextArea() {
  if (props.type == 'area' && props.modelValue.length) {
    charLength.value = props.modelValue.length;
    adjustHeight(areaText.value!);
  }
}

function adjustHeight(el: HTMLTextAreaElement) {
  el.style.height = '44px';
  el.style.height = `${el.scrollHeight}px`;
}

function onInput(e: Event) {
  const el = e.target as HTMLTextAreaElement;
  const val = el.value;
  if (props.type == 'area') adjustHeight(el);
  charLength.value = val.length;
}

const getVal = (e: Event) => (e.target as HTMLInputElement).value;
</script>

<template>
  <div class="ux-input__container">
    <!-- TEXT FIELD -->
    <input
      v-if="isTextField"
      :id="id"
      :class="[
        'ux-input__text',
        { '--limit-reached': charLimitReached && hasValidInput },
      ]"
      :type="type"
      :minlength="minchars"
      :maxlength="maxchars"
      :value="modelValue"
      placeholder="placeholder"
      @input="onInput($event), emit('update:modelValue', getVal($event))"
    />
    <!-- Floating LABEL -->
    <label v-if="isTextField" class="ux-input__label" :for="id"><slot /></label>

    <textarea
      v-if="type == 'area'"
      :id="id"
      ref="areaText"
      :class="['ux-input__area', { '--limit-reached': charLimitReached }]"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxchars"
      @keyup="validate(charLimitReached && hasValidInput, id)"
      @input="onInput($event), emit('update:modelValue', getVal($event))"
    />

    <!-- Animated Bottom Border -->
    <span
      :class="[
        'ux-input__bar',
        { '--limit-reached': charLimitReached && hasValidInput },
      ]"
    />

    <!-- Character Length Tally **/** -->
    <transition name="fade">
      <span
        v-if="isTextField ? showCharTally && tally : tally || showCharTally"
        :class="[
          'ux-input__char-limit',
          {
            '--length-reached': charLengthReached,
            '--limit-reached': charLimitReached,
          },
        ]"
      >
        {{ charLength }}&nbsp;/&nbsp;{{ maxchars }}
      </span>
    </transition>
    <transition name="fade">
      <span
        v-if="isTextField ? showCharLimit && tally : showCharLimit"
        class="ux-input__char-limit-msg"
      >
        <em>{{ charsRequired }}</em> more chars required
      </span>
      <span
        v-else-if="!hasValidInput && charLength > 0"
        class="ux-input__error-msg"
        v-html="errorMessage"
      />
    </transition>
  </div>
</template>
