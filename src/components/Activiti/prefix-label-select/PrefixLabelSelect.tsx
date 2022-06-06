import { Select } from 'ant-design-vue';
import { defineComponent, PropType, computed,reactive} from 'vue';
import './prefix-label-select.css';

const PrefixLabelSelect = defineComponent({
  props: {
    ...Select.props,
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
    const stats = reactive({
      res: '',
      choose: true,
      isblur: false,
      select: {}
    });
    const onBlur = ()=>{
      if (stats.res && !stats.choose) {
        computedModelValue.value= stats.res
      }
      stats.isblur = true
    }

    const onSearch = (value)=>{
      if (stats.choose || stats.isblur) {
        stats.res= ''
      }
      stats.choose = false
      stats.isblur = false
      if (value) {
        stats.res= value
      }
    }

    const onSelect = (value)=>{
      stats.choose = true
      computedModelValue.value = value
    }

    if(props.showSearch){
      stats.select =  {
        onBlur,
        onSearch,
        onSelect
      }          
    }else{
      stats.select = {}
    }

    return () => (
      <div class="prefix-label-select-container">
        {props.prefixTitle && <div class="prefix-title ">{props.prefixTitle}</div>}
        <Select
          class="prefix-label-select"
          {...props}
          {...stats.select}
          v-model:value={computedModelValue.value}
          v-slots={slots}
         
        />
      </div>
    );
  },
});

export default PrefixLabelSelect;
