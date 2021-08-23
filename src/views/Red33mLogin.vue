<template>
  <div class="red-login">
    <page-titlebar class="red-login__titlebar">
      RED33M Login
    </page-titlebar>
    <ux-text type="block" class="red-login__disclaimer">
      This page contains sensitive content which <em>requires authentication</em>.
      If you have a passcode, use the form below to grant yourself access.
      <br><br>
      <strong>Don't have a Passcode?</strong>
      <br>
      Fill out the
      <router-link to="/red33m/form">
        {{ "EC Form" }}
      </router-link>
      to gain eligibility; filling out the form <em>does not</em>
      guarantee a Passcode, it only makes you eligible.
    </ux-text>
    <form class="red-login__form">
      <ux-input
        v-model="code"
        class="passcode"
        :minchars="codeLength"
        :maxchars="codeLength"
        :validate="validate"
      >
        Passcode
      </ux-input>

      <ux-button
        class="button"
        type="submit"
        theme="attention"
        :loading="isPending"
        :disabled="!isValidated"
        @click="submit"
      >
        ENTER
      </ux-button>
      <br>
      <form-error
        class="error"
        :update="errorUpdVal"
        :text="errorText"
      />
    </form>
    <br>
    <ux-text type="span-block" class="red-login__disclaimer">
      <strong>NOTE:</strong> Do not clear your browser cache, otherwise you
      will need to enter the code again, when you come back to this page
      later.
    </ux-text>
    <ux-text type="span-block" class="red-login__disclaimer">
      <strong>CAVEAT:</strong> The passcode will only be saved for <em>this device</em>.
      In order to view this content on your other devices:
      <strong>computer, phone, tablet, etc...</strong>
      You <em>must enter the passcode again</em> on those devices.<br><br>
    </ux-text>
    <page-footer />
  </div>
</template>





<script lang='ts' setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { APIResponse, useAPI } from "@/services/api_internal";
import useInputValidation from "@/composeables/inputValidation";
import PageTitlebar from "@/components/PageTitlebar.vue";
import PageFooter from "@/components/PageFooter.vue";
import FormError from "@/components/FormError.vue";
import UxButton from "@/components/UxButton.vue";
import UxInput from "@/components/UxInput.vue";
import UxText from '@/components/UxText.vue';
import { useEventBus } from "@/state/event-bus";


const api             = useAPI();
const {isPending}     = api;
const router          = useRouter();
const {isValidated, validate}
                      = useInputValidation(1);
const eventBus        = useEventBus();
const codeLength      = 6;
const code            = ref('');
const errorText       = ref('');
const errorUpdVal     = ref(0);

function setError(res: APIResponse<string>) {
  errorText.value = res.data, errorUpdVal.value = Date.now();
}

function submit(e: MouseEvent) {
  e.preventDefault();
  const passcode = code.value.toUpperCase();
  api.debounce(100, () => {
    api
      .put('/auth/red33m', { passcode })
      .then(() => {
        localStorage.setItem('passcode', 'yes');
        eventBus.updateMenu('red-videos', true);
        eventBus.updateMenu('red-lit', true);
        eventBus.updateMenu('red-login', false);
        router.push('/red33m/videos');
      })
      .catch(setError)
    ;
  });
}

</script>


