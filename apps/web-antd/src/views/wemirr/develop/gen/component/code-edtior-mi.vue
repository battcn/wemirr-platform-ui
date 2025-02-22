<template>
  <div class="code-editor">
    <div class="toolbar">
      <a-button type="primary" @click="handleCopy">复制代码</a-button>
    </div>
    <Codemirror
      v-model="innerCommand"
      :readonly="readOnly"
      :style="{ height: `${height}px` }"
      basic
      :tabSize="2"
      :autofocus="true"
      :extensions="computedExtensions"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  onBeforeUnmount,
  ref,
  shallowRef,
  watch,
} from 'vue';
import useClipboard from 'vue-clipboard3';
import { Codemirror } from 'vue-codemirror';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorState, type Extension } from '@codemirror/state';
const props = defineProps<{
  command?: string;
  height?: number;
  readOnly?: boolean;
}>();

const emit = defineEmits(['update:command']);
const { toClipboard } = useClipboard();

const view = shallowRef();
const innerCommand = computed({
  get: () => props.command || '',
  set: (value) => {
  emit('update:command', value);
  },
});

const height = ref(props.height || 360);
const readOnly = ref(props.readOnly || false);

const computedExtensions = computed<Extension[]>(() => [
  java(),
  oneDark,
  EditorState.readOnly.of(readOnly.value)
]);

// Clean up before unmount
onBeforeUnmount(() => {
  view.value = null;
});

const updateContent = (newVal: string) => {
  if (!view.value) return;

  const state = view.value.state;
  const cursor = state.selection.main;

  try {
    const newDocLength = newVal ? newVal.length : 0;
    const newCursorPos = Math.min(cursor.from, newDocLength);

    view.value.dispatch({
      changes: {
        from: 0,
        to: state.doc.length,
        insert: newVal || '',
      },
      selection: { anchor: newCursorPos, head: newCursorPos },
    });
  } catch (error) {
    console.error('Error updating editor content:', error);
  }
};

const handleCopy = async () => {
  try {
    await toClipboard(innerCommand.value);
    alert('代码已复制到剪贴板');
  } catch (error) {
    console.error('复制失败:', error);
  }
};

watch(
  () => props.command,
  (newVal) => {
    updateContent(newVal || '');
  },
);

watch(
  () => props.readOnly,
  (newVal) => {
    readOnly.value = newVal ?? false;
    computedExtensions.value.splice(2, 1, EditorState.readOnly.of(readOnly.value));
  },
);
</script>

<style scoped>
.code-editor {
  font-size: 14px;
  line-height: 150%;
  height: 100%;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}
</style>
