import { InputNumber } from 'ant-design-vue';
import { defineComponent, PropType, computed} from 'vue';
import './prefix-label-number.css';

const PrefixLabelNumBer = defineComponent({
  props: {
    ...InputNumber.props,
    prefixTitle: {
      type: String as PropType<string>,
      default: () => '',
    },
  },
  emits: ['update:value'],
  setup(props, { emit, slots }) {
    const computedModelValue = computed({
      get: () => props.value,
      set: (val) => emit('update:value', val),
    });
    return () => (
      <div class="prefix-label-number-container">
        {props.prefixTitle && <div class="prefix-number-title ">{props.prefixTitle}</div>}
        <InputNumber
          class="prefix-label-number"
          {...props}
          v-model:value={computedModelValue.value}
          v-slots={slots}
        />
      </div>
    );
  },
});

export default PrefixLabelNumBer;
