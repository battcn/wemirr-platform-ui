<template>
  <PageWrapper content="修改成功后会自动退出当前登录！">
    <div class="py-8 bg-white flex flex-col justify-center items-center">
      <BasicForm @register="register" />
      <div class="flex justify-center">
        <a-button @click="resetFields"> 重置 </a-button>
        <a-button class="!ml-4" type="primary" @click="handleSubmit"> 确认 </a-button>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useUserStore } from '/@/store/modules/user';
  import { changePassword } from '/@/api/sys/user';
  import { formSchema } from './pwd.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    name: 'ChangePassword',
    components: { BasicForm, PageWrapper },
    setup() {
      const { createSuccessModal } = useMessage();
      const userStore = useUserStore();
      const [register, { validate, resetFields }] = useForm({
        size: 'large',
        labelWidth: 100,
        showActionButtonGroup: false,
        schemas: formSchema,
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          changePassword(values).then((ret) => {
            createSuccessModal({
              title: '提示',
              content: '修改成功,请重新登录',
              onOk: async () => {
                await userStore.logout(true);
              },
            });
          });
        } catch (error) {}
      }

      return { register, resetFields, handleSubmit };
    },
  });
</script>
