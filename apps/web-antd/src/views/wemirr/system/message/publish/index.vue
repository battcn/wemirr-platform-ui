<template>
  <Page
      content-class="w-height flex flex-col gap-4"
      description="提供给运营人员操作消息推送"
      title="消息推送"
  >
    <Card>
      <fs-form ref="formRef" v-bind="formOptions">
        <template #form_variables="scope">
          <div v-for="(val, key) in scope.form.variables" :key="key">
            <a-form-item>
              <a-input
                  :value="key"
                  placeholder="参数键"
                  style="width: 45%; margin-right: 8px"
              />
              <a-input
                  :value="val"
                  placeholder="参数值"
                  style="width: 40%; margin-right: 8px"
              />
              <DeleteOutlined/>
            </a-form-item>
          </div>
          <a-button
              type="dashed"
              style=" width: 30%;margin-left: 28%"
              size="small"
              @click="addVariables(scope)"
          >
            <PlusSquareOutlined/>
            添加参数
          </a-button>
        </template>
      </fs-form>
      <div style="margin-top: 50px;float: right">
        <a-button v-if="formRef" type="primary" @click="formRef.submit">发布</a-button>
      </div>
    </Card>
  </Page>
</template>

<script lang="ts">
import {useRoute} from "vue-router";
import {defineComponent, ref} from "vue";
import {Card} from 'ant-design-vue';
import {Page} from "@vben/common-ui";
import {createFormOptions} from "./publish";
import {DeleteOutlined, DownOutlined, PlusSquareOutlined} from "@ant-design/icons-vue";

function useFormDirect() {
  const formRef = ref();
  const formOptions = ref();
  formOptions.value = createFormOptions();
  const route = useRoute();
  const id: any = route.query.id;
  const code: any = route.query.code;
  const name: any = route.query.name;
  let variables = {'username': 'test', email: 'abc@63.com'}
  formOptions.value.initialForm = {code, name, context: '欢迎 {username} 来到 WP 系统', variables};

  function formSubmit() {
    alert(1)
    formRef.value.submit();
  }

  function setFormDataTest() {
    formRef.value.setFormData({
      customField: "test"
    });
  }

  function formReset() {
    formRef.value.reset();
  }

  return {
    formOptions,
    formRef,
    formSubmit,
    formReset,
    setFormDataTest
  };
}

export default defineComponent({
  name: "FormNewPageEdit",
  components: {DownOutlined, PlusSquareOutlined, DeleteOutlined, Page, Card},
  setup(props, ctx) {

    function addVariables(scope) {
      console.log('scope', scope)
      scope.form?.variables.push({
        key: "_genkey_",
        value: "123",
      });
    }

    return {
      addVariables,
      ...useFormDirect()
    };
  }
});
</script>
