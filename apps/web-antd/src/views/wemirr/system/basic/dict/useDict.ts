import { computed, ref } from 'vue';

import { FsFormWrapper, useFs, useUi } from '@fast-crud/fast-crud';

import * as api from './api';
import createFormOptions from './dict';
import createCrudOptions from './dict-item-crud';

export interface DictNode {
  id: number | string;
  code: string;
  type: number;
  name: string;
  sequence: number;
  description?: string;
  parentId?: number | string;
  children?: DictNode[];
}

export function useDictPage() {
  const { ui } = useUi();

  function useFormWrapperUsingTag(callback: any) {
    const formWrapperRef = ref<any | InstanceType<typeof FsFormWrapper>>();
    const formWrapperOptions = ref<any>();
    formWrapperOptions.value = createFormOptions(callback);
    const initData = {
      type: 0,
      sequence: 99,
      parentId: 0,
    };
    function openFormWrapper(form: any) {
      formWrapperOptions.value.initialForm = form || initData;
      formWrapperOptions.value.columns.code.component.disabled = false;
      formWrapperRef.value.open(formWrapperOptions.value);
    }

    return {
      formWrapperRef,
      openFormWrapper,
      formWrapperOptions,
    };
  }

  const treeData = ref<DictNode[]>([]);

  const loadDictList = async () => {
    const ret = await api.GetList();
    treeData.value = ret;
  };

  const syncDict = async () => {
    await api.incrSyncDict();
    await loadDictList();
    ui.notification.success({
      message: '增量同步字典成功',
      duration: 3,
    });
  };

  const { formWrapperRef, openFormWrapper, formWrapperOptions } =
    useFormWrapperUsingTag(() => loadDictList());

  const { crudBinding, crudRef, crudExpose } = useFs({
    createCrudOptions,
    context: { permission: 'tenant:dict' },
  });

  const handleMenuClick = (node: DictNode) => {
    const crudBindRef = crudBinding.value as any;
    const initialForm = { parentId: node.id, parentCode: node.code };
    crudBindRef.search.initialForm = initialForm;
    crudBindRef.addForm.initialForm = initialForm;
    crudBindRef.actionbar.buttons.add.show = true;
    crudExpose.setSearchFormData({ form: { ...initialForm } });
    crudExpose.doRefresh();
  };

  const handleEdit = (node: DictNode) => {
    const initForm = {
      id: node.id,
      code: node.code,
      type: node.type,
      name: node.name,
      sequence: node.sequence,
      description: node.description,
    };
    formWrapperOptions.value.columns.code.component.disabled = true;
    openFormWrapper(initForm);
  };

  const handleDelete = (node: DictNode) => {
    ui.Modal.confirm({
      iconType: 'error',
      title: '删除',
      content: `会级联删除子节点以及相关资源数据`,
      onOk: async () => {
        await api.DelObj(node.id);
        await loadDictList();
        ui.notification.success({
          message: '删除成功',
        });
      },
    } as any);
  };

  const searchText = ref('');
  const selectedKeys = ref<(number | string)[]>(['all']);

  const filteredTree = computed(() => {
    const keyword = searchText.value.trim().toLowerCase();
    if (!keyword) return treeData.value;
    return treeData.value.filter(
      (n) =>
        n.name?.toLowerCase().includes(keyword) ||
        n.code?.toLowerCase().includes(keyword),
    );
  });

  return {
    // state
    treeData,
    searchText,
    selectedKeys,
    filteredTree,
    // crud
    crudBinding,
    crudRef,
    crudExpose,
    // form wrapper
    formWrapperRef,
    openFormWrapper,
    formWrapperOptions,
    // actions
    loadDictList,
    syncDict,
    handleMenuClick,
    handleEdit,
    handleDelete,
  };
}

export type UseDictReturn = ReturnType<typeof useDictPage>;
