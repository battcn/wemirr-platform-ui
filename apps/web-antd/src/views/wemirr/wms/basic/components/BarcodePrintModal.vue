<script lang="ts" setup>
import { nextTick, ref } from 'vue';

import { BasicModal, useModalInner } from '#/components/Modal';
import { QrCode } from '#/components/Qrcode';
// 引入
import JsBarcode from 'jsbarcode';

// Emits声明
const emit = defineEmits(['register', 'success']);
const codes = ref();
// 表单赋值
const [registerModal, { setModalProps, closeModal }] = useModalInner(
  async (data) => {
    setModalProps({
      confirmLoading: false,
      showCancelBtn: false,
      showOkBtn: false,
    });
    codes.value = data.codes ? data.codes : [];
    nextTick(() => {
      codes.value.forEach((v, index) => {
        // 根据动态id，动态赋值，动态生成条形码
        JsBarcode(`#jsbarcodeImg${index}`, v, {
          // format: 'CODE39',
          width: 4,
          height: 200,
          fontSize: 100,
          textPosition: 'top',
          textMargin: 20,
        });
      });
    });

    if (data.record?.id) {
      setModalProps({
        confirmLoading: false,
        showCancelBtn: data?.showFooter,
        showOkBtn: data?.showFooter,
      });
    }
  },
);

// 设置标题
const title = t('条码管理');
function onPrint() {
  function getStyle() {
    const styleContent = `
      body {
        padding: 0 .3cm 0 1.2cm;
        }
      }`;
    const style = document.createElement('style');
    style.innerHTML = styleContent;
    return style;
  }
  const newWin = window.open('')!; // 新打开一个空窗口
  const new_str = document.querySelector('#printContents')!.innerHTML;
  const style = getStyle();
  newWin.document.body.innerHTML = new_str;
  newWin.document.body.append(style);
  newWin.print(); // 打印刚才新建的网页
  newWin.close(); // 打印或取消后关闭弹出的网页
}
function handleSubmit() {}
</script>

<template>
  <BasicModal
    v-bind="$attrs"
    :default-fullscreen="false"
    :title="title"
    :width="1200"
    destroy-on-close
    @ok="handleSubmit"
    @register="registerModal"
  >
    <div id="download_div">
      <div class="btn-group">
        <a-button ghost type="primary" @click="onPrint">
          {{ t('打印') }}
        </a-button>
      </div>
    </div>
    <section id="printContents" ref="print">
      <div class="document_view">
        <div class="document_body">
          <div class="js_barcode">
            <div
              v-for="(item, index) in codes"
              :id="`js_barcode_item${index}`"
              :key="index"
              class="js_barcode_item"
              style="
                display: flex;
                page-break-after: always;
                height: 100%;
                line-height: 100%;
                align-items: center;
              "
            >
              <div>
                <QrCode
                  :key="item"
                  :height="100"
                  :value="item"
                  :width="100"
                  tag="img"
                />
              </div>
              <div
                style="
                  flex: 1;
                  padding: 0 10px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <img
                  :id="`jsbarcodeImg${index}`"
                  style="height: 80px; max-width: 100%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </BasicModal>
</template>

<style lang="less" scoped>
/** 时间和数字输入框样式 */
:deep(.ant-input-number) {
  width: 100%;
}

:deep(.ant-calendar-picker) {
  width: 100%;
}

.document_view {
  margin: 20px auto;
  padding: 0;
  width: 900px;
  //border: 1px solid #aaa;
  font-size: 12px;
}

#download_div {
  margin: 20px auto;
  width: 900px;
  text-align: right !important;
}

.document_view .document_header {
  border-bottom: 2px solid #000;
  padding: 20px 0 10px 0;
  width: 100%;
  display: inline-block;
}

.document_view .title {
  font-size: 24px;
  line-height: 30px;
  font-family: 'Microsoft YaHei', '宋体', 'Raleway', 'Helvetica Neue', Roboto,
    sans-serif;
}

.document_view .center {
  text-align: center;
}

.document_view .document_header,
.document_view .document_body {
  width: 100%;
  display: inline-block;
}

.document_body table {
  width: 880px;
  margin: 10px 0 10px 10px;
  border-collapse: collapse;
}

.document_body table th,
.document_body table td {
  width: 110px;
  border: 1px solid #000;
  height: 25px;
  padding: 0 4px;
  text-align: center;
}

.document_body table th {
  background-color: #f2f2f2;
  text-align: center;
}

.document_view p {
  margin: 0;
  line-height: 25px;
}
.js_barcode {
  display: flex;
  flex-wrap: wrap;
  .js_barcode_item {
    border: 1px solid #aaa;
    margin: 10px 10px 10px 18px;
    width: 30%;
  }
}
</style>
