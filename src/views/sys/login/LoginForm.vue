<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <Alert message="0000=平台(全部权限); 8888=演示租户(租户权限)" type="success" closable />
    <FormItem name="tenantCode" class="enter-x">
      <Input size="large" v-model:value="formData.tenantCode" placeholder="租户编码" />
    </FormItem>
    <FormItem name="username" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.username"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>
    <FormItem name="code" class="enter-x">
      <PictureCode
        size="large"
        class="fix-auto-fill"
        ref="pictureRef"
        autocomplete="off"
        v-model:value="formData.code"
        placeholder="验证码"
      />
    </FormItem>
    <!--    <FormItem class="enter-x" name="code">
      <ACol :md="12" :xs="24">
        <Input
          size="large"
          style="min-width: 200px"
          visibilityToggle
          v-model:value="formData.code"
          placeholder="验证码"
        />
      </ACol>
      <ACol :md="12" :xs="24" :offset="2">
        <img
          v-show="true"
          :src="formState.captchaSrc"
          @click="loadCaptcha"
          alt="captcha"
          class="code-image"
        />
      </ACol>
    </FormItem>-->
    <!--    <ARow class="enter-x" v-show="formState.showCaptcha">
      <ACol :md="12" :xs="24">
        <FormItem class="code-input" name="code">
          <Input
            size="large"
            style="min-width: 200px"
            visibilityToggle
            v-model:value="formData.code"
            placeholder="验证码"
          />
        </FormItem>
      </ACol>
      <ACol :md="9" :xs="24" :offset="3">
        <img
          v-show="true"
          :src="formState.captchaSrc"
          @click="loadCaptcha"
          alt="captcha"
          class="code-image"
        />
      </ACol>
    </ARow>-->
    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t("sys.login.rememberMe") }}
          </Checkbox>
        </FormItem>
      </ACol>
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t("sys.login.forgetPassword") }}
          </Button>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t("sys.login.loginButton") }}
      </Button>
      <!-- <Button size="large" class="mt-4 enter-x" block @click="handleRegister">
        {{ t('sys.login.registerButton') }}
      </Button> -->
    </FormItem>
    <ARow class="enter-x">
      <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.MOBILE)">
          {{ t("sys.login.mobileSignInFormTitle") }}
        </Button>
      </ACol>
      <ACol :md="8" :xs="24" class="!my-2 !md:my-0 xs:mx-0 md:mx-2">
        <Button block @click="setLoginState(LoginStateEnum.QR_CODE)">
          {{ t("sys.login.qrSignInFormTitle") }}
        </Button>
      </ACol>
      <ACol :md="6" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.REGISTER)">
          {{ t("sys.login.registerButton") }}
        </Button>
      </ACol>
    </ARow>

    <Divider class="enter-x">{{ t("sys.login.otherSignIn") }}</Divider>

    <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
      <GithubFilled />
      <WechatFilled />
      <AlipayCircleFilled />
      <GoogleCircleFilled />
      <TwitterCircleFilled />
    </div>
  </Form>
</template>
<script lang="ts" setup>
import { reactive, ref, unref, computed, onMounted } from "vue";

import { Alert, Checkbox, Form, Input, Row, Col, Button, Divider } from "ant-design-vue";
import {
  GithubFilled,
  WechatFilled,
  AlipayCircleFilled,
  GoogleCircleFilled,
  TwitterCircleFilled,
} from "@ant-design/icons-vue";
import LoginFormTitle from "./LoginFormTitle.vue";

import { useI18n } from "@/hooks/web/useI18n";
import { useMessage } from "@/hooks/web/useMessage";

import { useUserStore } from "@/store/modules/user";
import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from "./useLogin";
import { useDesign } from "@/hooks/web/useDesign";
import { PictureCode } from "@/components/PictureCode";
import { useWatermark } from "@/hooks/web/useWatermark";
import { useGlobSetting } from "@/hooks/setting";

const ACol = Col;
const ARow = Row;
const FormItem = Form.Item;
const InputPassword = Input.Password;
const { t } = useI18n();
const { notification, createErrorModal } = useMessage();
const { prefixCls } = useDesign("login");
const userStore = useUserStore();

const { setLoginState, getLoginState } = useLoginState();
const { getFormRules } = useFormRules();
const { setWatermark } = useWatermark();

const formRef = ref();
const loading = ref(false);
const rememberMe = ref(false);
const pictureRef = ref();
const formData = reactive({
  tenantCode: "0000",
  username: "admin",
  password: "123456",
  code: "",
});

const { validForm } = useFormValid(formRef);

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);
const { title } = useGlobSetting();

onMounted(async () => {
  setWatermark(title);
});

async function handleLogin() {
  const data = await validForm();
  if (!data) return;
  try {
    loading.value = true;
    const userInfo = await userStore.login({
      password: data.password,
      username: data.username,
      grant_type: "password",
      client_id: "client",
      client_secret: "client",
      scope: "server",
      tenant_code: data.tenantCode,
      auth_type: "vc",
      vc_code: data.code,
      vc_token: pictureRef?.value?.pictureRef?.imgData?.captchaId,
      goHome: true,
      mode: "none", //不要默认的错误提示
    });
    if (userInfo) {
      notification.success({
        message: t("sys.login.loginSuccessTitle"),
        description: `${t("sys.login.loginSuccessDesc")}: ${userInfo.realName}`,
        duration: 3,
      });
    }
  } catch (error) {
    createErrorModal({
      title: t("sys.api.errorTip"),
      content: (error as unknown as Error).message || t("sys.api.networkExceptionMsg"),
      getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
    });
    pictureRef?.value?.refreshCode();
  } finally {
    loading.value = false;
  }
}
</script>
