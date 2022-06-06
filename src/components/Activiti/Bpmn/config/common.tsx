import { Input } from 'ant-design-vue';
import { FieldDefine } from '/@/components/Activiti/dynamic-binder';
import { PropertiesMap, GroupProperties } from './index';
import SubList from '/@/components/Activiti/sublist/SubList.vue';
import { ModdleElement } from '../type';
import { BpmnStore } from '../store';

/**
 * 所有通用节点的属性（每个节点都有的）
 */
const commonProperties: PropertiesMap<FieldDefine> = {
  id: {
    component: Input,
    placeholder: '节点编号',
    vSlots: {
      addonBefore: (): JSX.Element => <div>节点编号</div>,
    },
    setValue(sourceObject: ModdleElement, key: string, value: string) {
      const isNotNull = value;
      const latestValue = value || ' ';
      const shape = BpmnStore.getShape();
      BpmnStore.getModeling().updateProperties(shape, {
        [key]: isNotNull ? latestValue.trim() : latestValue,
      });
    },
  },
  name: {
    component: Input,
    placeholder: '节点名称',
    vSlots: {
      addonBefore: (): JSX.Element => <div>节点名称</div>,
    },
  },
};

/**
 * （基础信息）每个节点都有的
 */
export const CommonGroupProperties: GroupProperties = {
  name: '基础信息',
  icon: 'ant-design:info-circle-filled',
  properties: { ...commonProperties },
};

interface Documentation {
  text: string;
}

export const DocumentGroupProperties: GroupProperties = {
  name: '元素文档',
  icon: 'el-icon-document',
  properties: {
    'documentation.text': {
      component: Input.TextArea,
      type: 'textarea',
      allowClear:'allow-clear',
      getValue: (obj: { documentation: Array<Documentation> }): string => {
        return obj['documentation']?.[0]?.['text'];
      },
      setValue(businessObject: ModdleElement, key: string, value: unknown): void {
        BpmnStore.createElement('bpmn:Documentation', 'documentation', { text: value }, true);
      },
    },
  },
};

interface PropertyElement {
  $type: string;
  name: string;
  value: unknown;
}

/**
 * 流程事件类型选项
 */
const EVENT_OPTIONS = [
  { label: '开始', value: 'start' },
  { label: '结束', value: 'end' },
];

/**
 * 监听器类型选项
 */
const TYPE_OPTIONS = [
  { label: 'java类', value: 'class' },
  { label: '调用表达式', value: 'expression' },
  { label: '注入表达式', value: 'delegateExpression' },
];

/**
 * 获取节点类型的监听器属性配置组
 * @param options 参数
 */
import { TaskNameMapping } from './TypeNameMapping';

const taskTags = Object.keys(TaskNameMapping);
export const getElementTypeListenerProperties = function (options: {
  name: string;
  icon?: string;
  //时间类型选项
  eventOptions?: Array<{ label: string; value: string }>;
}): GroupProperties {
  const eventOptions = options.eventOptions || EVENT_OPTIONS;
  return {
    name: options.name || '监听器',
    icon: options.icon || 'ant-design:monitor-outlined',
    properties: {
      'extensionElements.listeners': {
        component: SubList,
        columns: [
          {
            dataIndex: 'index',
            title: '序号',
            align: 'center',
            width: 50,
            editRow:false,
            customRender: ({index}) => `${index+1}`,
          },
          {
            title: '事件',
            dataIndex: 'event',
            align: 'center',
            editRow: true,
            editRule: true,
            editComponent: 'Select',
            editComponentProps: {
              options: eventOptions,
            },
          },
          {
            title: '执行类型',
            dataIndex: 'type',
            align: 'center',
            editRow: true,
            editRule: true,
            editComponent: 'Select',
            editComponentProps: {
              options: TYPE_OPTIONS,
            },
          },
          {
            dataIndex: 'content',
            title: '执行内容',
            editRule: true,
            align: 'center',
            editRow:true
          },
        ],
        getValue: (businessObject: ModdleElement): Array<any> => {
          const listenerTagName = taskTags.includes(businessObject.$type)
            ? 'activiti:TaskListener'
            : 'activiti:ExecutionListener';
          return businessObject?.extensionElements?.values
            ?.filter((item: ModdleElement) => item.$type === listenerTagName)
            ?.map((item: ModdleElement) => {
              const type = item.expression
                ? 'expression'
                : item.delegateExpression
                ? 'delegateExpression'
                : 'class';
              return {
                event: item.event,
                type: type,
                content: item[type],
              };
            });
        },
        setValue(businessObject: ModdleElement, key: string, value: []): void {
          const bpmnContext = BpmnStore;
          console.warn('activeBusinessObject', businessObject);
          const moddle = bpmnContext.getModeler().get('moddle');
          //判断当前活动的模型类型，使用不同类型的标签监听器
          const listenerTagName = taskTags.includes(businessObject.$type)
            ? 'activiti:TaskListener'
            : 'activiti:ExecutionListener';
          bpmnContext.updateExtensionElements(
            listenerTagName,
            value.map((attr: { event: string; type: string; content: string }) => {
              return moddle.create(listenerTagName, {
                event: attr.event,
                [attr.type]: attr.content,
              });
            }),
          );
        },
      },
    },
  };
};

/**
 * 扩展属性组配置
 */
export const ExtensionGroupProperties: GroupProperties = {
  name: '扩展属性',
  icon: 'ant-design:file-add-outlined',
  properties: {
    'extensionElements.properties': {
      component: SubList,
      columns: [
        {
          dataIndex: 'index',
          title: '序号',
          width: 50,
          align: 'center',
          editRow:false,
          customRender: ({index}) => `${index+1}`,
        },
        {
          dataIndex: 'name',
          title: '属性名',
          editRule: true,
          align: 'center',
          editRow:true
        },
        {
          dataIndex: 'value',
          title: '属性值',
          editRule: true,
          align: 'center',
          editRow:true
        },
      ],
      getValue: (businessObject: ModdleElement): Array<any> => {
        return businessObject?.extensionElements?.values
          ?.filter((item: PropertyElement) => item.$type === 'activiti:Properties')[0]
          ?.values.map((item: PropertyElement) => ({
            name: item.name,
            value: item.value,
          }));
      },
      setValue(businessObject: ModdleElement, key: string, value: []): void {
        const bpmnContext = BpmnStore;
        const moddle = bpmnContext.getModeler().get('moddle');
        const properties = moddle.create(`activiti:Properties`, {
          values: value.map((attr: { name: string; value: unknown }) => {
            return moddle.create(`activiti:Property`, { name: attr.name, value: attr.value });
          }),
        });
        bpmnContext.updateExtensionElements('activiti:Properties', properties);
      },
    },
  },
};

interface FromPropertyElement {
  $type: string;
  id: string;
  type: string;
  $attrs: FromPropertyAttrsElement;
}

interface FromPropertyAttrsElement {
  name: string;
}

/**
 * （基础信息）表单
 */
export const FormGroupProperties: GroupProperties = {
  name: '表单信息',
  icon: 'el-icon-edit',
  properties: {
    formKey: {
      component: Input,
      placeholder: '表单key',
      vSlots: {
        addonBefore: (): JSX.Element => <div>表单key</div>,
      },
    },
    'extensionElements.formProperty': {
      component: SubList,
      columns: [
        {
          dataIndex: 'id',
          title: '编码',
          editRule: true,
          align: 'center',
          editRow:true
        },
        {
          dataIndex: 'type',
          title: '类型',
          editRule: true,
          align: 'center',
          editRow:true
        },
        {
          dataIndex: 'name',
          title: '名称',
          editRule: true,
          align: 'center',
          editRow:true
        },
      ],
      getValue: (businessObject: ModdleElement): Array<FromPropertyElement> => {
        return businessObject?.extensionElements?.values
          ?.filter((item: FromPropertyElement) => item.$type === 'activiti:FormProperty')
          .map((elem: FromPropertyElement) => {
            console.warn('elem', elem);
            return { id: elem?.id, type: elem.type, name: elem?.$attrs?.name };
          });
      },
      setValue(businessObject: ModdleElement, key: string, value: []): void {
        const bpmnContext = BpmnStore;
        const moddle = bpmnContext.getModeler().get('moddle');
        //表单数据值对象
        const formProperties = value.map((attr: { id: string; type: string; name: string }) => {
          return moddle.create('activiti:FormProperty', {
            id: attr.id,
            name: attr.name,
            type: attr.type,
          });
        });

        bpmnContext.updateExtensionElements('activiti:FormProperty', formProperties);
      },
    },
  },
};
