import {
  CommonGroupProperties,
  ExtensionGroupProperties,
  DocumentGroupProperties,
} from '../common';
import { Input } from 'ant-design-vue';

const CommonGroupPropertiesArray = [
  CommonGroupProperties,
  ExtensionGroupProperties,
  DocumentGroupProperties,
];

interface CategoryValueRef {
  value: string;
}

const BpmnGroupBaseProperties = {
  name: '基础信息',
  icon: 'el-icon-info',
  properties: {
    id: {
      component: Input,
      placeholder: '节点ID',
      vSlots: {
        prepend: (): JSX.Element => <div>节点ID</div>,
      },
    },
    name: {
      component: Input,
      // prefix: '节点名称',
      placeholder: '节点名称',
      vSlots: {
        prepend: (): JSX.Element => <div>节点名称</div>,
      },
      getValue: (obj: { categoryValueRef: CategoryValueRef }): string => {
        return obj?.categoryValueRef?.value;
      },
    },
  },
};

export default {
  //池
  'bpmn:Participant': CommonGroupPropertiesArray,
  //分组
  'bpmn:Group': [BpmnGroupBaseProperties, ExtensionGroupProperties, DocumentGroupProperties],
  //数据存储
  'bpmn:DataStoreReference': CommonGroupPropertiesArray,
  //数据对象
  'bpmn:DataObjectReference': CommonGroupPropertiesArray,
};
