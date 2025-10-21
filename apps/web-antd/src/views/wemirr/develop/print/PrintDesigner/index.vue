<script setup>
import { computed, onMounted, ref } from 'vue';
import {
  defaultElementTypeProvider,
  hiprint,
  hiPrintPlugin,
} from 'vue-plugin-hiprint';

import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons-vue';
import { FsButton, FsIcon } from '@fast-crud/fast-crud';
import { useLocalStorage } from '@vueuse/core';
import { message } from 'ant-design-vue';

import LeftLayout from '#/views/wemirr/develop/print/PrintDesigner/left-layout.vue';
import PrintPreview from '#/views/wemirr/develop/print/PrintDesigner/preview.vue';

import printData from './print-data.ts';
import providers from './providers.ts';

const activeKeyRightPrint = ['1', '2'];
let hiprintTemplate;
hiPrintPlugin.disAutoConnect();
// 初始化 provider
hiprint.init({
  providers: [defaultElementTypeProvider()],
});
// 响应式状态
const mode = ref(0);
const modeList = ref([]);
const paperPopVisible = ref(false);
const paperWidth = ref('220');
const paperHeight = ref('80');
// const template = ref();
const scaleValue = ref(1);
const scaleMax = 5;
const scaleMin = 0.5;
/**
 * 构建左侧可拖拽元素
 * 注意: 可拖拽元素必须在 hiprint.init() 之后调用
 * 而且 必须包含 class="ep-draggable-item" 否则无法拖拽进设计器
 */
const buildLeftElement = () => {
  hiprint.PrintElementTypeManager.buildByHtml($('.ep-draggable-item'));
};
/**
 * 构建设计器
 * 注意: 必须要在 onMounted 中去构建
 * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
 */
const buildDesigner = () => {
  $('#hiprint-printTemplate').empty(); // 先清空, 避免重复构建
  hiprintTemplate = new hiprint.PrintTemplate({
    settingContainer: '#PrintElementOptionSetting', // 元素参数容器
  });
  // 构建 并填充到 容器中
  // 可以先 console.log($("#hiprint-printTemplate")) 看看是否有该 dom
  hiprintTemplate.design('#hiprint-printTemplate');
};

const curPaper = ref({
  type: 'other',
  width: 220,
  height: 80,
});

const paperTypes = {
  A3: { width: 420, height: 296.6 },
  A4: { width: 210, height: 296.6 },
  A5: { width: 210, height: 147.6 },
  B3: { width: 500, height: 352.6 },
  B4: { width: 250, height: 352.6 },
  B5: { width: 250, height: 175.6 },
};

// 计算属性
const curPaperType = computed(() => {
  let type = 'other';
  const types = paperTypes;
  for (const key in types) {
    const item = types[key];
    const { width, height } = curPaper.value;
    if (item.width === width && item.height === height) {
      type = key;
    }
  }
  return type;
});

const changeMode = () => {
  const provider = providers[mode.value];
  hiprint.init({
    providers: [provider.f],
  });
  $('.hiprintEpContainer').empty();
  hiprint.PrintElementTypeManager.build('.hiprintEpContainer', provider.value);
  $('#hiprint-printTemplate').empty();
  const templates = useLocalStorage('KEY_TEMPLATES', {});
  const templateData = templates.value[provider.value]
    ? templates.value[provider.value]
    : {};
  hiprintTemplate = new hiprint.PrintTemplate({
    template: templateData,
    dataMode: 1,
    history: false,
    onDataChanged: (type, json) => {
      console.log(type, json);
    },
    settingContainer: '#PrintElementOptionSetting',
    paginationContainer: '.hiprint-printPagination',
  });
  hiprintTemplate.design('#hiprint-printTemplate');
  scaleValue.value = hiprintTemplate.editingPanel?.scale || 1;
};
// 方法
const init = () => {
  modeList.value = providers.map((e) => {
    return { type: e.type, name: e.name, value: e.value };
  });
  changeMode();
};
// 纸张设置相关方法
const setPaper = (type, value) => {
  paperPopVisible.value = false;
  curPaper.value = {
    type,
    width: value.width,
    height: value.height,
  };
  hiprintTemplate.setPaper(value.width, value.height);
};

const otherPaper = () => {
  paperPopVisible.value = false;
  const value = {
    width: Number(paperWidth.value),
    height: Number(paperHeight.value),
  };
  curPaper.value = {
    type: 'other',
    ...value,
  };
  hiprintTemplate.setPaper(value.width, value.height);
};

// 缩放控制
const changeScale = (isAdd) => {
  let newScale = scaleValue.value;
  if (isAdd) {
    newScale += 0.1;
  } else {
    newScale -= 0.1;
  }

  if (newScale <= scaleMax && newScale >= scaleMin) {
    scaleValue.value = newScale;
    hiprintTemplate.zoom(newScale);
  }
};
const preview = ref();
// const printData = { name: 'CcSimple' };
/**
 * 获取打印html
 */
const openPreview = () => {
  // const html = hiprintTemplate.getHtml(printData);
  preview.value.showModal(hiprintTemplate, printData);
};
const exportPdf = () => {
  hiprintTemplate.toPdf({}, '打印预览');
};

const setElsAlign = (e) => {
  hiprintTemplate.setElsAlign(e);
};

/**
 * 浏览器打印
 */
const print = () => {
  // 打印数据，key 对应 元素的 字段名
  // const printData = { name: 'CcSimple' };
  // 参数: 打印时设置 左偏移量，上偏移量
  const options = { leftOffset: -1, topOffset: -1 };
  // 扩展
  const ext = {
    callback: () => {},
    styleHandler: () => {
      // 重写 文本 打印样式
      return '<style>.hiprint-printElement-text{color:red !important;}</style>';
    },
  };
  // 调用浏览器打印
  hiprintTemplate.print(printData, options, ext);
};

// 保存与清空
const save = () => {
  const templates = useLocalStorage('KEY_TEMPLATES', {});
  const provider = providers[mode.value];
  templates.value[provider.value] = hiprintTemplate.getJson();
  message.success('保存成功');
};

const clearPaper = () => {
  hiprintTemplate.clear();
  message.success('清空成功');
};
/**
 * 这里必须要在 onMounted 中去构建 左侧可拖拽元素 或者 设计器
 * 因为都是把元素挂载到对应容器中, 必须要先找到该容器
 */
onMounted(() => {
  buildLeftElement();
  buildDesigner();
  init();
});
</script>

<template>
  <a-card>
    <a-row :gutter="[8, 0]" style="margin-bottom: 10px">
      <a-col :span="4" />
      <!--      <a-col :span="4">
        &lt;!&ndash; 模板选择 &ndash;&gt;
        <a-select
          size="small"
          v-model:value="mode"
          show-search
          @change="changeMode"
          :default-value="0"
          style="width: 100%"
        >
          <a-select-option
            v-for="(opt, idx) in modeList"
            :key="idx"
            :value="idx"
          >
            {{ opt.name }}
          </a-select-option>
        </a-select>
      </a-col>-->
      <a-col :span="14">
        <a-space>
          <!-- 纸张设置 -->
          <a-button-group size="small">
            <template v-for="(value, type) in paperTypes" :key="type">
              <a-button
                :type="curPaperType === type ? 'primary' : 'default'"
                @click="setPaper(type, value)"
              >
                {{ type }}
              </a-button>
            </template>
            <a-popover
              v-model:open="paperPopVisible"
              title="设置纸张宽高(mm)"
              trigger="click"
            >
              <template #content>
                <a-input-group compact style="margin: 10px">
                  <a-input-number
                    v-model:value="paperWidth"
                    style="width: 100px; text-align: center"
                    placeholder="宽(mm)"
                  />
                  <a-input
                    style="
                      width: 30px;
                      pointer-events: none;
                      background-color: #fff;
                      border-left: 0;
                    "
                    placeholder="~"
                    disabled
                  />
                  <a-input-number
                    v-model:value="paperHeight"
                    style="width: 100px; text-align: center; border-left: 0"
                    placeholder="高(mm)"
                  />
                </a-input-group>
                <a-button
                  type="primary"
                  style="width: 100%"
                  @click="otherPaper"
                >
                  确定
                </a-button>
              </template>
              <a-button
                :type="'other' === curPaperType ? 'primary' : 'default'"
              >
                自定义纸张
              </a-button>
            </a-popover>
          </a-button-group>
          <a-button type="text" size="small">
            <template #icon>
              <ZoomOutOutlined @click="changeScale(false)" />
            </template>
          </a-button>
          <a-input-number
            size="small"
            v-model:value="scaleValue"
            :min="scaleMin"
            :max="scaleMax"
            :step="0.1"
            disabled
            style="width: 70px"
            :formatter="(value) => `${(value * 100).toFixed(0)}%`"
            :parser="(value) => value.replace('%', '')"
          />
          <a-button type="text" size="small">
            <template #icon>
              <ZoomInOutlined @click="changeScale(true)" />
            </template>
          </a-button>

          <!--          <a-radio-group size="small">
            <a-radio-button @click="setElsAlign('left')" title="左对齐">
              <FsIcon icon="gravity-ui:object-align-left" />
            </a-radio-button>
            <a-radio-button @click="setElsAlign('vertical')" title="居中">
              <FsIcon icon="gravity-ui:object-align-center-vertical" />
            </a-radio-button>
            <a-radio-button @click="setElsAlign('right')" title="右对齐">
              <FsIcon icon="gravity-ui:object-align-right" />
            </a-radio-button>
            <a-radio-button @click="setElsAlign('top')" title="顶部对齐">
              <FsIcon icon="gravity-ui:object-align-top" />
            </a-radio-button>
            <a-radio-button @click="setElsAlign('horizontal')" title="垂直居中">
              <FsIcon icon="gravity-ui:object-align-justify-vertical" />
            </a-radio-button>
            <a-radio-button @click="setElsAlign('bottom')" title="底部对齐">
              <FsIcon icon="gravity-ui:object-align-bottom" />
            </a-radio-button>
            <a-radio-button
              @click="setElsAlign('distributeHor')"
              title="横向分散"
            >
              <FsIcon icon="mdi:resize-horizontal" />
            </a-radio-button>
            <a-radio-button
              @click="setElsAlign('distributeVer')"
              title="纵向分散"
            >
              <FsIcon icon="mdi:resize-vertical" />
            </a-radio-button>
          </a-radio-group>-->
        </a-space>
      </a-col>
      <a-col :span="6">
        <!-- 预览/打印 -->
        <a-button-group size="small">
          <FsButton type="primary" @click.stop="exportPdf">
            <FsIcon icon="mdi:export" />
            导出PDF
          </FsButton>
          <FsButton type="primary" @click.stop="openPreview">
            <FsIcon icon="mdi:print-preview" />
            预览
          </FsButton>
          <!-- 预览 -->
          <PrintPreview ref="preview" />
          <FsButton type="primary" @click.stop="print">
            <FsIcon icon="mdi:printer" />
            在线打印
          </FsButton>
          <a-popconfirm
            title="是否确认清空?"
            ok-type="danger"
            ok-text="确定清空"
            @confirm="clearPaper"
          >
            <template #icon>
              <FsIcon
                icon="mdi:map-marker-question-outline"
                style="color: red"
              />
            </template>
            <FsButton type="primary" danger>
              <FsIcon icon="mdi:close-outline" />
              清空
            </FsButton>
          </a-popconfirm>
          <FsButton type="primary" @click.stop="save">
            <FsIcon icon="mdi:content-save-outline" />
            保存
          </FsButton>
        </a-button-group>
      </a-col>
    </a-row>
    <a-row :gutter="[8, 0]">
      <a-col :span="5">
        <a-card style="height: 100vh" class="print-layout-left">
          <LeftLayout :hiprint-template="hiprintTemplate" />
        </a-card>
      </a-col>
      <a-col :span="14">
        <a-card class="card-design">
          <div id="hiprint-printTemplate" class="hiprint-printTemplate"></div>
        </a-card>
      </a-col>
      <a-col :span="5" class="params_setting_container">
        <a-card>
          <a-tabs
            default-active-key="properties"
            tab-position="top"
            type="line"
          >
            <a-tab-pane key="properties" tab="控件属性">
              <!-- 元素参数的 容器 -->
              <a-row class="hinnn-layout-sider">
                <div id="PrintElementOptionSetting"></div>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="print" tab="打印设置">
              <a-collapse v-model:active-key="activeKeyRightPrint" ghost>
                <a-collapse-panel
                  key="1"
                  header="基础属性"
                  style="font-weight: bold"
                >
                  <a-form layout="vertical" style="font-weight: lighter">
                    <a-form-item label="模板编号">
                      <a-input placeholder="请输入" />
                    </a-form-item>
                    <a-form-item label="模板名称">
                      <a-input placeholder="请输入" />
                    </a-form-item>
                  </a-form>
                </a-collapse-panel>
              </a-collapse>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<style lang="less" scoped>
// build 拖拽
/deep/ .hiprint-printElement-type > li > ul > li > a {
  height: auto !important;
}
// 设计容器
.card-design {
  overflow: hidden;
  overflow: auto;
}

/deep/ .ant-card-body {
  padding: 12px;
}

.print-layout-left {
  /deep/ .ant-card-body {
  }
}
</style>
