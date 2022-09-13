<template>
  <Image
    :width="'100px'"
    :height="'37px'"
    :preview="false"
    :src="imgSrc"
    @click="getPicture"
    :fallback="code404"
  />
</template>
<script lang="ts">
  import { getPictureCode } from '/@/api/modules/sys/loginCommon';
  import { defineComponent, onMounted, ref } from 'vue';
  import { Image } from 'ant-design-vue';
  import code404 from '/@/assets/images/picture_code_404.png';
  export default defineComponent({
    name: 'ImageButton',
    components: { Image },
    emits: ['codeId'],
    setup(_props, { emit }) {
      const imgSrc = ref('');
      /**
       * @description: 获取二维码
       */
      async function getPicture() {
        const pictureData = await getPictureCode();
        imgSrc.value = pictureData.codeValue;
        emit('codeId', pictureData.codeId);
      }
      onMounted(() => {
        getPicture();
      });
      return { getPicture, imgSrc, code404 };
    },
  });
</script>
