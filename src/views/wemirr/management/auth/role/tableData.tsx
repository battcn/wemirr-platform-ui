import { FormProps, FormSchema } from '@/components/Table';
import { BasicColumn } from '@/components/Table/src/types/table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '资源吗',
      dataIndex: 'permission',
      width: 150,
    },
    {
      title: '名称',
      width: 150,
      dataIndex: 'label',
    },
  ];
}

const renderContent = ({ text, index }: { text: any; index: number }) => {
  const obj: any = {
    children: text,
    attrs: {},
  };
  if (index === 9) {
    obj.attrs.colSpan = 0;
  }
  return obj;
};
export function getMergeHeaderColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 300,
      customRender: renderContent,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 300,
      customRender: renderContent,
    },
    {
      title: '地址',
      dataIndex: 'address',
      colSpan: 2,
      width: 120,
      sorter: true,
      customRender: ({ text, index }: { text: any; index: number }) => {
        const obj: any = {
          children: text,
          attrs: {},
        };
        if (index === 2) {
          obj.attrs.rowSpan = 2;
        }
        if (index === 3) {
          obj.attrs.colSpan = 0;
        }
        return obj;
      },
    },
    {
      title: '编号',
      dataIndex: 'no',
      colSpan: 0,
      filters: [
        { text: 'Male', value: 'male', children: [] },
        { text: 'Female', value: 'female', children: [] },
      ],
      customRender: renderContent,
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      width: 200,
      customRender: renderContent,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 200,
      customRender: renderContent,
    },
  ];
}
export const getAdvanceSchema = (itemNumber = 6): FormSchema[] => {
  const arr: any = [];
  for (let index = 0; index < itemNumber; index++) {
    arr.push({
      field: `field${index}`,
      label: `字段${index}`,
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 8,
      },
    });
  }
  return arr;
};
export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      ...getAdvanceSchema(5),
      {
        field: `field11`,
        label: `Slot示例`,
        component: 'Select',
        slot: 'custom',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
    ],
  };
}
export function getBasicData() {
  const data: any = (() => {
    const arr: any = [];
    for (let index = 0; index < 40; index++) {
      arr.push({
        id: `${index}`,
        name: 'John Brown',
        age: `1${index}`,
        no: `${index + 10}`,
        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
        beginTime: new Date().toLocaleString(),
        endTime: new Date().toLocaleString(),
      });
    }
    return arr;
  })();
  return data;
}

export function getTreeTableData() {
  const data: any = (() => {
    const arr: any = [];
    for (let index = 0; index < 40; index++) {
      arr.push({
        id: `${index}`,
        name: 'John Brown',
        age: `1${index}`,
        no: `${index + 10}`,
        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
        beginTime: new Date().toLocaleString(),
        endTime: new Date().toLocaleString(),
        children: [
          {
            id: `l2-${index}`,
            name: 'John Brown',
            age: `1${index}`,
            no: `${index + 10}`,
            address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
            beginTime: new Date().toLocaleString(),
            endTime: new Date().toLocaleString(),
          },
        ],
      });
    }
    return arr;
  })();

  return data;
}
