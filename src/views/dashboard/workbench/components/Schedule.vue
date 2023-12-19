<template>
  <Card :bordered="false">
    <a-calendar v-model:value="calendarValue" :fullscreen="false" @select="onPanelSelect" />
    <a-timeline style="margin-left: 10px">
      <a-timeline-item :key="item.id" v-for="item in scheduleList">
        {{ item.time }} {{ item.desc }}
        <a style="float: right"><DeleteOutlined @click="deleteSchedule(item)" /></a>
      </a-timeline-item>
    </a-timeline>
    <a class="add-schedule" @click="openScheduleForm"><PlusSquareOutlined /> 新增日程</a>
  </Card>
</template>

<script setup name="schedule">
import dayjs from "dayjs";
import { DeleteOutlined, PlusSquareOutlined } from "@ant-design/icons-vue";
import { Card } from "ant-design-vue";
import { onMounted, ref } from "vue";
import { scheduleItems } from "./data";
import { useColumns, useFormWrapper } from "@fast-crud/fast-crud";
import createCrudOptions from "./schedule";

const scheduleList = ref([]);

const calendarValue = ref(dayjs());

onMounted(() => {
  // 进来后执行查询
  loadScheduleList();
});

const loadScheduleList = () => {
  // 从数据库加载,为了偷懒这里从 scheduleItems 加载静态的了
  scheduleList.value = scheduleItems;
  console.log("选中的日历值", calendarValue.value.format("YYYY-MM-DD"));
};

// 点击某一天
const onPanelSelect = () => {
  loadScheduleList();
};
// 删除
const deleteSchedule = (item) => {
  scheduleList.value = scheduleList.value.filter((i) => i.id !== item.id);
};

const { openDialog } = useFormWrapper();
const createScheduleFromCrudOptions = () => {
  const { buildFormOptions } = useColumns();
  const { crudOptions } = createCrudOptions({ calendarValue });
  return buildFormOptions(crudOptions);
};

async function openScheduleForm() {
  const opts = createScheduleFromCrudOptions();
  await openDialog(opts);
}
</script>
