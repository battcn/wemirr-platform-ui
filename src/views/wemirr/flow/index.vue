<template>
  <div>
    <iframe
      src="https://goldsubmarine.github.io/workflow-bpmn-modeler/cdn/0.2.8/"
      id="myFrame"
      frameborder="0"
      width="100%"
      height="800px"
    >
    </iframe>
  </div>
</template>

<!--
<script>
  import bpmnModeler from 'workflow-bpmn-modeler';

  import { defineComponent, ref, reactive, onMounted } from 'vue';
  export default defineComponent({
    name: 'FLowManagement',
    components: { bpmnModeler },
    setup() {
      const bpmnData = reactive({
        xml: '',
        users: [
          { name: '披头士', id: '1' },
          { name: '滚石乐队', id: '2' },
          { name: '平克·佛洛伊德', id: '3' },
        ],
        groups: [
          { name: 'web', id: '4' },
          { name: 'java', id: '5' },
          { name: 'python', id: '6' },
        ],
        categories: [
          { name: '音乐', id: '7' },
          { name: '文章', id: '8' },
        ],
      });
      onMounted(() => {});
      function save() {}
      return {
        bpmnData,
        save,
      };
    },
  });
</script>
-->
