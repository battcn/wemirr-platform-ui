<template>
  <div class="sublist-div">
    <BasicTable @register="registerTable" @edit-change="onEditChange">
      <template #action="{ record, column }">
        <TableAction :actions="createActions(record, column)" />
      </template>
    </BasicTable>
    <div class="sublist-add" @click="addData" v-if="!sublistState.editing"> {{ addTitle }} </div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, reactive, watch, ref } from 'vue';
  import type { BasicTableProps } from '/@/components/Table/src/types/table';
  import {
    BasicTable,
    useTable,
    TableAction,
    BasicColumn,
    ActionItem,
    EditRecordRow,
  } from '/@/components/Table';
  import { SubListState } from './type';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  const { createMessage: msg } = useMessage();
  const emit = defineEmits(['update:value']);
  const currentEditKeyRef = ref('');

  //-------------------------------------------------

  const props = defineProps({
    /**
     * v-model
     */
    value: {
      type: Array,
      default: () => [],
      required: true,
    },
    /**
     * 列的描述信息
     * @see TableColumn
     */
    columns: {
      type: Array as PropType<BasicColumn[]>,
      required: true,
    },
    /**
     * 原型对象（用于new）
     */
    model: {
      type: Object as PropType<{ [key: string]: string }>,
      default: () => Object.assign({}),
    },
    /**
     * 表格的参数
     * @see TableProps
     */
    tableProps: {
      type: Object as PropType<BasicTableProps<any>>,
      default: () => ({
        striped: true,
        bordered: true,
        size: 'small',
        canResize: false,
        pagination: false,
        showIndexColumn: false,
        showTableSetting: false,
        tableSetting: { fullScreen: true },
        locale: {
          emptyText: '没有数据',
        },
      }),
    },
    /**
     * 添加按钮的标题
     */
    addTitle: {
      type: String as PropType<string>,
      default: () => '+ 添加',
    },
  });

  const sublistState: SubListState<any> = reactive({
    data: props.value ? JSON.parse(JSON.stringify(props.value)) : [],
    editing: false,
    isNew: false,
  });

  const [
    registerTable,
    { insertTableDataRecord, deleteTableDataRecord, setTableData, getDataSource },
  ] = useTable({
    ...props.tableProps,
    dataSource: sublistState.data,
    scroll: { x: 0 },
    columns: props.columns,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      fixed: false,
      slots: { customRender: 'action' },
    },
  });

  //重置状态
  const restoreState = () => {
    sublistState.data = props.value ? JSON.parse(JSON.stringify(props.value)) : [];
    sublistState.editing = false;
    sublistState.isNew = false;
  };

  watch(
    () => props.value,
    () => {
      restoreState();
    },
  );

  /**
   * 添加数据项并进行编辑
   */
  const addData = async (): Promise<void> => {
    let recordList: EditRecordRow[] = getDataSource();
    if (recordList.length === 0) {
      await setTableData([cloneDeep(props.model) as Recordable]);
    } else {
      await insertTableDataRecord(cloneDeep(props.model) as Recordable);
    }
    recordList = getDataSource();
    const record = recordList[recordList.length - 1];
    currentEditKeyRef.value = record.key;
    await record.onEdit?.(true);
    sublistState.editing = true;
    sublistState.isNew = true;
  };

  function handleEdit(record: EditRecordRow) {
    currentEditKeyRef.value = record.key;
    record.onEdit?.(true);
  }

  function handleCancel(record: EditRecordRow) {
    if (sublistState.isNew) {
      deleteTableDataRecord(record.key);
    } else {
      record.onEdit?.(false, false);
    }
    sublistState.isNew = false;
    sublistState.editing = false;
    currentEditKeyRef.value = '';
  }

  function handleRemove(record: EditRecordRow) {
    currentEditKeyRef.value = '';
    sublistState.isNew = false;
    sublistState.editing = false;
    deleteTableDataRecord(record.key);
    emit('update:value', sublistState.data);
  }

  async function handleSave(record: EditRecordRow) {
    // 校验
    msg.loading({ content: '正在保存...', duration: 0, key: 'saving' });
    const valid = await record.onValid?.();
    if (valid) {
      try {
        //当前提交数据，全部提交一次
        //const data = cloneDeep(record.editValueRefs);
        let recordList: EditRecordRow[] = getDataSource();
        let data = [] as Recordable[];
        recordList.map((attr: { editValueRefs: Recordable }) => {
          data.push(attr.editValueRefs);
        });
        console.log(data);
        //TODO 此处将数据提交给服务器保存
        emit('update:value', data);
        // 保存之后提交编辑状态
        const pass = await record.onEdit?.(false, true);
        if (pass) {
          currentEditKeyRef.value = '';
        }
        sublistState.isNew = false;
        sublistState.editing = false;
        msg.success({ content: '数据已保存', key: 'saving' });
      } catch (error) {
        msg.error({ content: '保存失败', key: 'saving' });
      }
    } else {
      msg.error({ content: '请填写正确的数据', key: 'saving' });
    }
  }

  function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
    if (!record.editable) {
      return [
        {
          label: '编辑',
          disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
          onClick: handleEdit.bind(null, record),
        },
        {
          label: '删除',
          disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
          popConfirm: {
            title: '是否删除',
            confirm: handleRemove.bind(null, record),
          },
        },
      ];
    }
    return [
      {
        label: '保存',
        onClick: handleSave.bind(null, record, column),
      },
      {
        label: '取消',
        popConfirm: {
          title: '是否取消编辑',
          confirm: handleCancel.bind(null, record, column),
        },
      },
    ];
  }

  const onEditChange = ({ column, value, record }) => {
    // 本例
    if (column.dataIndex === 'id') {
      record.editValueRefs.name4.value = `${value}`;
    }
  };
</script>

<style lang="less" scoped>
  .sublist-add {
    margin-top: 8px;
    border: 1px solid #409eff;
    text-align: center;
    cursor: pointer;
    color: #fff;
    font-weight: bold;
    border-radius: 4px;
    background-color: #409eff;
  }

  .sublist-add:hover {
    border-color: #66b1ff;
    background-color: #66b1ff;
  }

  .sublist-actions .sublist-btn {
    margin: 0 5px;
  }

  .sublist-edit,
  .sublist-confirm {
    color: #409eff;
  }

  .sublist-split {
    color: #bbbec3;
  }

  .sublist-btn {
    cursor: pointer;
  }

  .sublist-btn:hover {
    border-bottom: 2px solid;
  }

  .sublist-edit :hover,
  .sublist-confirm:hover {
    color: #66b1ff;
  }

  .sublist-delete {
    color: #fa3b3b;
  }

  .sublist-delete:hover {
    color: #f78989;
  }

  .sublist-actions .readonly {
    color: #bbbec3;
    cursor: default;
  }

  .sublist-actions .readonly:hover {
    border-bottom: none;
  }

  .sublist-form-item {
    width: 100%;
    margin-right: 0 !important;
    margin-bottom: 0 !important;
  }

  .sublist-form-item .el-form-item__content {
    width: 100%;
  }
</style>
