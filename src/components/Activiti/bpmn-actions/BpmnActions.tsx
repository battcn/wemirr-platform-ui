import { defineComponent, ref, nextTick } from 'vue';
import ButtonRender, { ButtonRenderProps } from '/@/components/Activiti/button-render';
import { BpmnStore } from '/@/components/Activiti/Bpmn/store';
import CodeMirror from 'codemirror';
import { Drawer ,Input } from 'ant-design-vue';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/addon/hint/xml-hint.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import '/@/components/Activiti/iconfont';
import './bpmn-actions.css';
import { ModdleElement } from '/@/components/Activiti/Bpmn/type';

export default defineComponent({
  name: 'BpmnActions',
  setup() {
    //放大缩小
    const zoom = ref(1);
    //预览xml的抽屉控制器
    const previewActive = ref(false);
    //取到的xml
    const xml = ref('');

    return {
      zoom,
      previewActive,
      xml,
    };
  },
  render() {
    const bpmnContext = BpmnStore;
    //codemirror编辑器
    let coder: CodeMirror.EditorFromTextArea;

    const importFile = function (event: Event) {
      const eventTarget = event.target as HTMLInputElement;
      if (eventTarget.files) {
        const file = eventTarget.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
          if (this.result) {
            bpmnContext.importXML(this.result as string);
          }
        };
      }
    };
    const buttonRenderProps: ButtonRenderProps = {
      buttons: [
        {
          label: '导入',
          icon: 'icon-shangchuan',
          action: () => {
            document.getElementById('bpmn-upload-element')?.click();
          },
        },
        {
          label: '导出SVG',
          icon: 'icon-zu920',
          action: () => {
            const rootElement: ModdleElement = bpmnContext
              .getModeler()
              .get('canvas')
              .getRootElement();
            bpmnContext
              .getSVG()
              .then((response) => {
                download(response.svg, rootElement.id || 'process', 'svg');
              })
              .catch((err: unknown) => {
                console.warn(err);
              });
          },
        },
        {
          label: '导出XML',
          icon: 'icon-zu1359',
          action: () => {
            const rootElement: ModdleElement = bpmnContext
              .getModeler()
              .get('canvas')
              .getRootElement();
            bpmnContext
              .getXML()
              .then((response: { xml: string }) => {
                download(response.xml, rootElement.id || 'process', 'bpmn');
              })
              .catch((err: unknown) => {
                console.warn(err);
              });
          },
        },
        {
          label: '放大',
          icon: 'icon-fangda',
          action: () => {
            this.zoom = Math.floor(this.zoom * 100 + 0.1 * 100) / 100;
            bpmnContext.getModeler().get('canvas').zoom(this.zoom);
          },
        },
        {
          label: '缩小',
          icon: 'icon-suoxiao',
          action: () => {
            this.zoom = Math.floor(this.zoom * 100 - 0.1 * 100) / 100;
            bpmnContext.getModeler().get('canvas').zoom(this.zoom);
          },
        },
        {
          label: '还原并居中',
          icon: 'icon-quxiaoquanping',
          action: () => {
            this.zoom = 1;
            bpmnContext.getModeler().get('canvas').zoom('fit-viewport', 'auto');
          },
        },
        {
          label: '预览',
          icon: 'icon-xianshi',
          action: async () => {
            console.warn();
            await bpmnContext
              .getXML()
              .then((response) => {
                this.previewActive = true;
                this.xml = response.xml;
              })
              .catch((err: unknown) => {
                console.warn(err);
              });
              await nextTick(() => {
                if (!coder) {
                  const html = document.getElementById('xml-highlight-container') as HTMLTextAreaElement;
                  coder = CodeMirror.fromTextArea(
                    html,
                    {
                      lineWrapping: true,
                      readOnly: true,//只读
                      mode: 'application/xml', // HMTL混合模式
                      theme: 'material',
                      lineNumbers: true
                      // theme: 'monokai', // 使用monokai模版
                    },
                  );
                  coder.setSize('100%', '100%');
                } else {
                  coder.setValue(this.xml);
                }
              });
          },
        },
        {
          label: '撤销',
          icon: 'icon-weibiaoti545',
          action: () => {
            bpmnContext.getModeler().get('commandStack').undo();
          },
        },
        {
          label: '恢复',
          icon: 'icon-weibiaoti546',
          action: () => {
            bpmnContext.getModeler().get('commandStack').redo();
          },
        },
      ],
    };
    return (
      <div class="bpmn-actions">
        <ButtonRender {...buttonRenderProps} />
        <Drawer placement="left" v-model:visible={this.previewActive}  width="35%" height="100%" destroyOnClose={true} closable={false}>
          <textarea id="xml-highlight-container" v-model={this.xml} />
        </Drawer>
        <Input
          type="file"
          id="bpmn-upload-element"
          ref="refFile"
          style="display: none"
          accept=".xml, .bpmn"
          onChange={importFile}
        />
      </div>
    );
  },
});

//文本下载
const download = (data: string, filename: string, type: string): void => {
  const blob = new Blob([data]);
  const tempLink = document.createElement('a'); // 创建a标签
  const href = window.URL.createObjectURL(blob); // 创建下载的链接
  //filename
  const fileName = `${filename}.${type}`;
  tempLink.href = href;
  tempLink.target = '_blank';
  tempLink.download = fileName;
  document.body.appendChild(tempLink);
  tempLink.click(); // 点击下载
  document.body.removeChild(tempLink); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
};
