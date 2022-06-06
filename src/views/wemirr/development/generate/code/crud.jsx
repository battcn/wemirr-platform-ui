import { GET, POST, DELETE, PUT, request } from '/src/api/service';
import moment from 'moment';
import { dict } from '@fast-crud/fast-crud';
import { downloadByData } from '/src/utils/file/download';

export default function ({ expose, userStore }) {
  const pageRequest = async (query) => await GET('/tools/generates', query);
  const editRequest = async ({ form }) => await PUT(`/tools/generates/${form.id}`, form);
  const delRequest = async ({ row }) => await DELETE(`/tools/generates/${row.id}`);
  const addRequest = async ({ form }) => await POST('/tools/generates', form);
  return {
    crudOptions: {
      request: {
        pageRequest,
        editRequest,
        delRequest,
        addRequest,
      },
      table: {
        scroll: { fixed: true },
      },
      rowHandle: {
        width: 200,
        fixed: 'right',
        buttons: {
          download: {
            icon: 'ant-design:cloud-download-outlined',
            type: 'link',
            text: null,
            size: 'small',
            title: '文件下载',
            async click(context) {
              console.log('context', context);
              await request({
                url: `/tools/generates/${context.row.id}/download`,
                method: 'POST',
                responseType: 'blob',
              }).then((res) => {
                downloadByData(res, `${context.row.moduleName}.zip`);
              });
            },
          },
          remove: { order: 2 },
        },
      },
      // actionbar: {
      //   show: true,
      //   buttons: {
      //     add: {
      //       show: true,
      //       async click(context) {
      //         // const getRealName = computed(() => userStore.getUserInfo?.realName);
      //         console.log('context', userStore.getUserInfo);
      //       },
      //     },
      //   },
      // },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        author: {
          title: '作者',
          type: 'text',
          search: { show: true },
          column: { width: 180 },
          addForm: {
            value: userStore.getUserInfo?.realName,
          },
        },
        tableName: {
          title: '表名',
          type: 'dict-select',
          dict: dict({
            url: '/tools/generates/tables',
          }),
          column: { width: 120 },
          form: {
            component: {
              showSearch: true,
              filterOption(inputValue, option) {
                return (
                  option.label.indexOf(inputValue) >= 0 || option.value.indexOf(inputValue) >= 0
                );
              },
            },
          },
        },
        tablePrefix: {
          title: '表前缀',
          type: 'text',
          column: { width: 80 },
          form: {
            helper: '文件前缀擦除(t_ => t_user => User)',
          },
        },
        moduleName: {
          title: '模块名',
          type: 'text',
          column: { width: 180 },
        },
        parentPackage: {
          title: '父包',
          type: 'text',
          column: { width: 250 },
        },
        apiUrlPrefix: {
          title: 'API前缀',
          type: 'text',
          column: { width: 180 },
        },
        swagger2: {
          title: 'Swagger',
          type: 'dict-radio',
          form: { value: true },
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
          column: { width: 100 },
        },
        rootDir: {
          title: '根目录',
          type: 'text',
          column: { width: 160 },
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          form: { show: false },
          valueBuilder({ value, row, key }) {
            if (value != null) {
              row[key] = moment(value);
            }
          },
        },
      },
    },
  };
}
