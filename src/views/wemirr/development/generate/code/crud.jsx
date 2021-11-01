import { GET } from '/src/api/service';
import moment from 'moment';

export default function ({ expose }) {
  const pageRequest = async (query) => await GET('/tools/generates', query);
  return {
    crudOptions: {
      request: {
        pageRequest,
      },
      table: {
        scroll: { fixed: true },
      },
      rowHandle: {
        width: 120,
        //固定右侧
        fixed: 'right',
      },
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
        },
        tablePrefix: {
          title: '表前缀',
          type: 'text',
          column: { width: 80 },
        },
        tableName: {
          title: '表名',
          type: 'text',
          column: { width: 120 },
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
          title: 'API地址前缀',
          type: 'text',
          column: { width: 180 },
        },
        swagger: {
          title: 'Swagger',
          type: 'text',
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
