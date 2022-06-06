import {
  CommonGroupProperties,
  FormGroupProperties,
  DocumentGroupProperties,
  ExtensionGroupProperties,
  getElementTypeListenerProperties,
} from '../common';
import { GroupProperties } from '../index';
import PrefixLabelSelect from '/@/components/Activiti/prefix-label-select';
import PrefixLabelNumBer from '/@/components/Activiti/prefix-label-number';
import { Input,SelectOption } from 'ant-design-vue';
import { ModdleElement } from '../../type';
import { BpmnStore } from '../../store';

const TASK_EVENT_OPTIONS = [
  { label: '创建', value: 'create' },
  { label: '签收', value: 'assignment' },
  { label: '完成', value: 'complete' },
  { label: '删除', value: 'delete' },
  { label: '全部', value: 'all' },
];

const TaskListenerProperties = getElementTypeListenerProperties({
  name: '任务监听器',
  eventOptions: TASK_EVENT_OPTIONS,
});

const USER_OPTIONS = [
  { label: '张三', value: '1' },
  { label: '李四', value: '2' },
  { label: '王五', value: '3' },
];

const UserOption: JSX.Element = (
  <>
    {USER_OPTIONS.map((item) => {
      return <SelectOption value={item.value} >{item.label}</SelectOption>;
    })}
  </>
);

/**
 * 用户任务属性配置
 */
export const BpmnUserGroupProperties: GroupProperties = {
  name: '人员设置',
  icon: 'el-icon-user-solid',
  properties: {
    /**
     * 处理人属性
     */
    assignee: {
      component: PrefixLabelSelect,
      prefixTitle: '处理人',
      allowCreate: true,
      filterable: true,
      showSearch:true,
      vSlots: {
        default: (): JSX.Element => UserOption,
      },
    },
    /**
     * 候选人属性
     */
    candidateUsers: {
      component: PrefixLabelSelect,
      prefixTitle: '候选人',
      filterable: true,
      multiple: true,
      mode:"tags",
      allowCreate: true,
      vSlots: {
        default: (): JSX.Element => UserOption,
      },
      getValue(businessObject: ModdleElement): string {
        console.warn('businessObject', businessObject);
        return 'string' === typeof businessObject.candidateUsers
          ? businessObject.candidateUsers.split(',')
          : businessObject.candidateUsers;
      },
    },
    /**
     * 循环基数
     */
    loopCardinality: {
      component: PrefixLabelNumBer,
      prefixTitle: '循环基数',
      min:0,
      precision:0,
      predicate(businessObject: ModdleElement): boolean {
        return businessObject.loopCharacteristics;
      },
      getValue(businessObject: ModdleElement): string {
        const loopCharacteristics = businessObject.loopCharacteristics;
        if (!loopCharacteristics) {
          return '';
        }
        return loopCharacteristics.loopCardinality?.body;
      },
      setValue(businessObject: ModdleElement, key: string, value: string): void {
        value = String(value);
        const bpmnContext = BpmnStore;
        const moddle = bpmnContext.getModeler().get('moddle');
        const loopCharacteristics = businessObject.loopCharacteristics;
        loopCharacteristics.loopCardinality = moddle.create('bpmn:FormalExpression', {
          body: value,
        });
        bpmnContext.getModeling().updateProperties(bpmnContext.getShape(), {
          loopCharacteristics: loopCharacteristics,
        });
      },
    },
    /*任务参与人 */
    collection:{
      component: PrefixLabelSelect,
      prefixTitle: '任务参与人',
      filterable: true,
      multiple: true,
      mode:"tags",
      allowCreate: true,
      vSlots: {
        default: (): JSX.Element => UserOption,
      },
      predicate(businessObject: ModdleElement): boolean {
        return businessObject.loopCharacteristics;
      },
      getValue(businessObject: ModdleElement): string {
        const loopCharacteristics = businessObject.loopCharacteristics;
        if (!loopCharacteristics) {
          return '';
        }
        return loopCharacteristics.collection;
      },
      setValue(businessObject: ModdleElement, key: string, value: string): void {
        const bpmnContext = BpmnStore;
        const loopCharacteristics = businessObject.loopCharacteristics;
        loopCharacteristics.collection = value
        bpmnContext.getModeling().updateProperties(bpmnContext.getShape(), {
          loopCharacteristics: loopCharacteristics,
        });
      },
    },
    /*元素变量*/
    elementVariable:{
      component: Input,
      placeholder: '元素变量',
      vSlots: {
        addonBefore: (): JSX.Element => <div>元素变量</div>,
      },
      predicate(businessObject: ModdleElement): boolean {
        return businessObject.loopCharacteristics;
      },
      getValue(businessObject: ModdleElement): string {
        const loopCharacteristics = businessObject.loopCharacteristics;
        if (!loopCharacteristics) {
          return '';
        }
        return loopCharacteristics.elementVariable;
      },
      setValue(businessObject: ModdleElement, key: string, value: string): void {
        const bpmnContext = BpmnStore;
        const loopCharacteristics = businessObject.loopCharacteristics;
        loopCharacteristics.elementVariable = value
        bpmnContext.getModeling().updateProperties(bpmnContext.getShape(), {
          loopCharacteristics: loopCharacteristics,
        });
      },
    },
    /**
     * 多实例完成条件
     * nr是number单词缩写
     * 1.nrOfInstances  实例总数。
     * 2.nrOfCompletedInstances  已经完成的实例个数
     * 3.loopCounter 已经循环的次数。
     * 4.nrOfActiveInstances 当前还没有完成的实例
     */
    completionCondition: {
      component: Input,
      placeholder: '如：${nrOfCompletedInstances/nrOfInstances >= 0.25} 表示完成数大于等于4分1时任务完成',
      vSlots: {
        addonBefore: (): JSX.Element => <div>完成条件</div>,
      },
      predicate(businessObject: ModdleElement): boolean {
        return businessObject.loopCharacteristics;
      },
      getValue(businessObject: ModdleElement): string {
        const loopCharacteristics = businessObject.loopCharacteristics;
        if (!loopCharacteristics) {
          return '';
        }
        return loopCharacteristics.completionCondition?.body;
      },
      setValue(businessObject: ModdleElement, key: string, value: string): void {
        const bpmnContext = BpmnStore;
        const moddle = bpmnContext.getModeler().get('moddle');
        const loopCharacteristics = businessObject.loopCharacteristics;
        loopCharacteristics.completionCondition = moddle.create('bpmn:FormalExpression', {
          body: value,
        });
        bpmnContext.getModeling().updateProperties(bpmnContext.getShape(), {
          loopCharacteristics: loopCharacteristics,
        });
      },
    },
  },
};

const LOOP_OPTIONS = [
  { label: '无', value: 'Null' },
  { label: '并行多重事件', value: 'Parallel' },
  { label: '时序多重事件', value: 'Sequential' },
  { label: '循环事件', value: 'StandardLoop' },
];

const LoopOptions: JSX.Element = (
  <>
    {LOOP_OPTIONS.map((item) => {
      return <SelectOption v-model:value={item.value} >{item.label}</SelectOption>;
    })}
  </>
);
/**
 * 任务的基本属性配置
 */
const BaseTaskProperties = {
  ...CommonGroupProperties,
  properties: {
    ...CommonGroupProperties.properties,
    loopCharacteristics: {
      component: PrefixLabelSelect,
      prefixTitle: '回路特性',
      vSlots: {
        default: (): JSX.Element => LoopOptions,
      },
      getValue(businessObject: ModdleElement): string {
        const loopCharacteristics = businessObject.loopCharacteristics;
        if (!loopCharacteristics) {
          return 'Null';
        }

        if (loopCharacteristics.$type === 'bpmn:MultiInstanceLoopCharacteristics') {
          return loopCharacteristics.isSequential ? 'Sequential' : 'Parallel';
        } else {
          return 'StandardLoop';
        }
      },
      setValue(businessObject: ModdleElement, key: string, value: string): () => void {
        const shape = BpmnStore.getShape();
        const modeling = BpmnStore.getModeling();
        switch (value) {
          case 'Null':
            modeling.updateProperties(shape, {
              loopCharacteristics: null,
            });
            // delete businessObject.loopCharacteristics;
            break;
          case 'StandardLoop':
            BpmnStore.createElement('bpmn:StandardLoopCharacteristics', 'loopCharacteristics');
            break;
          default:
            BpmnStore.createElement(
              'bpmn:MultiInstanceLoopCharacteristics',
              'loopCharacteristics',
              {
                isSequential: value === 'Sequential',
              },
            );
        }
        return () => BpmnStore.refresh();
      },
    },
  },
};

const CommonGroupPropertiesArray = [
  BaseTaskProperties,
  TaskListenerProperties,
  ExtensionGroupProperties,
  DocumentGroupProperties,
];

export default {
  //普通任务
  'bpmn:Task': CommonGroupPropertiesArray,
  //用户任务
  'bpmn:UserTask': [
    BaseTaskProperties,
    BpmnUserGroupProperties,
    TaskListenerProperties,
    FormGroupProperties,
    ExtensionGroupProperties,
    DocumentGroupProperties,
  ],
  //接收任务
  'bpmn:ReceiveTask': CommonGroupPropertiesArray,
  //发送任务
  'bpmn:SendTask': CommonGroupPropertiesArray,
  //手工任务
  'bpmn:ManualTask': CommonGroupPropertiesArray,
  //业务规则任务
  'bpmn:BusinessRuleTask': CommonGroupPropertiesArray,
  //服务任务
  'bpmn:ServiceTask': CommonGroupPropertiesArray,
  //脚本任务
  'bpmn:ScriptTask': CommonGroupPropertiesArray,
  //调用任务
  'bpmn:CallActivity': CommonGroupPropertiesArray,
};
