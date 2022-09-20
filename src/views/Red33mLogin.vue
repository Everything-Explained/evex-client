

<script lang='ts' setup>
import { ref } from "vue";
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
const {isValidated, validate}
                      = useInputValidation(1);
const eventBus        = useEventBus();
const codeLength      = 6;
const code            = ref('');
const errorText       = ref('');
const errorUpdVal     = ref(0);
const loginSuccess    = ref(false);

function setError(res: APIResponse<{ message: string }>) {
  errorText.value = res.data.message, errorUpdVal.value = Date.now();
}

function submit(e: MouseEvent) {
  e.preventDefault();
  const passcode = code.value.toUpperCase();
  api.debounce(100, () => {
    api
      .put('/auth/red33m', { passcode })
      .then(() => {
        loginSuccess.value = true;
        localStorage.setItem('passcode', 'yes');
        eventBus.updateMenu('red-videos', true);
        eventBus.updateMenu('red-lit', true);
        eventBus.updateMenu('red-login', false);
      })
      .catch(setError)
    ;
  });
}

</script>





<template>
  <div class="red-login-container">
    <page-titlebar
      :ease-in="350"
      :ease-out="350"
      :class="['red-login__titlebar', { '--logged-in': loginSuccess }]"
      :text="loginSuccess ? 'RED33M Access Granted!' : 'RED33M Login'"
    />
    <transition name="fade" mode="out-in">
      <div v-if="!loginSuccess" class="red-login">
        <ux-text type="block" custom-class="red-login__disclaimer">
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
            custom-class="error"
            :update="errorUpdVal"
            :text="errorText"
          />
        </form>
        <br>
        <ux-text type="span-block" custom-class="red-login__disclaimer">
          <strong>NOTE:</strong> Do not clear your browser cache, otherwise you
          will need to enter the code again, when you come back to this page
          later.
        </ux-text>
        <ux-text type="span-block" custom-class="red-login__disclaimer">
          <strong>CAVEAT:</strong> The passcode will only be saved for <em>this device</em>.
          In order to view this content on your other devices:
          <strong>computer, phone, tablet, etc...</strong>
          You <em>must enter the passcode again</em> on those devices.<br><br>
        </ux-text>
        <page-footer />
      </div>
      <div v-else>
        <ux-text type="block">
          You have <b>successfully</b> gained access to the <em>RED33M</em> section.
          <br><br>
          If you open the menu, you will notice that under the RED33M header, there will
          now be two new options: <b>Literature</b> and <b>Videos</b>.
          <br><br>
          Unlike the public Literature page, there are no categories, since they fall under
          the <em>RED33M</em> category. If you have any general questions or concerns
          you can goto our <router-link to="/support">Support Page</router-link>. However if you
          need specific help with something that our Support page does not cover, feel free to
          email <b>Ethan</b> for any <em>one on one</em> needs.
        </ux-text>
        <page-footer />
      </div>
    </transition>
  </div>
</template>








