<template>
  <div class="red33m-auth">
    <pg-titlebar class="r3d-auth__titlebar">
      RED33M Login
    </pg-titlebar>
    <ux-text type="block" class="r3d-auth__disclaimer">
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
    <form class="r3d-auth__form">
      <ux-input
        v-model="code"
        class="r3d-auth__passcode"
        :minchars="6"
        :maxchars="6"
        :validate="validate"
      >
        Passcode
      </ux-input>

      <ux-button
        class="r3d-auth__button"
        type="submit"
        theme="attention"
        :loading="isLoading"
        :disabled="!isValidated"
        @click="submit"
      >
        ENTER
      </ux-button>
      <br>
      <form-error
        class="r3d-auth__error"
        :update="errorUpdVal"
        :text="errorText"
      />
    </form>
    <br>
    <ux-text type="span-block" class="r3d-auth__note">
      <strong>NOTE:</strong> Do not clear your browser cache, otherwise you
      will need to enter the code again, when you come back to this page
      later.
    </ux-text>
    <ux-text type="span-block" class="r3d-auth__note">
      <strong>CAVEAT:</strong> The passcode will only be saved for <em>this device</em>.
      In order to view this content on your other devices:
      <strong>computer, phone, tablet, etc...</strong>
      You <em>must enter the passcode again</em> on those devices.<br><br>
    </ux-text>
    <pg-footer />
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { APIErrorResp, useAPI } from "@/services/api_internal";
import useInputValidation from "@/composeables/inputValidation";
import PageTitlebarVue from "@/components/PageTitlebar.vue";
import PageFooterVue from "@/components/PageFooter.vue";
import FormErrorVue from "@/components/FormSubmitError.vue";
import uxButtonVue from "@/components/UxButton.vue";
import uxInputVue from "@/components/UxInput.vue";
import uxTextVue from '@/components/UxText.vue';

export default defineComponent({
  components: {
    'pg-titlebar' : PageTitlebarVue,
    'pg-footer'   : PageFooterVue,
    'form-error'  : FormErrorVue,
    'ux-input'    : uxInputVue,
    'ux-button'   : uxButtonVue,
    'ux-text'     : uxTextVue,
  },
  setup() {
    const codeLength   = 6;
    const codeRef      = ref('');
    const errorTextRef = ref('');
    const errorUpdVal  = ref(0);
    const api          = useAPI();
    const router       = useRouter();
    const inputValidation = useInputValidation(1);

    function setError(res: APIErrorResp) {
      errorTextRef.value = res.message;
      errorUpdVal.value = Date.now();
    }

    function submit(e: MouseEvent) {
      e.preventDefault();
      const passcode = codeRef.value.toUpperCase();
      api.debounce(200, () => {
        api
          .put('/auth/red33m', { passcode })
          .then(() => {
            localStorage.setItem('passcode', 'yes');
            router.push('/red33m/videos');
          })
          .catch(setError)
        ;
      });
    }

    return {
      isLoading: api.isPending,
      code: codeRef,
      codeLength,
      submit,
      ...inputValidation,
      errorText: errorTextRef,
      errorUpdVal,
    };
  }
});
</script>