import { request } from '/src/api/service';

export default function ({ expose }) {
  const pageRequest = async (query) => {
    return await request({
      url: '/authority/opt_logs',
      method: 'get',
      params: query,
    }).then((ret) => {
      return ret.data;
    });
  };
  const delRequest = async ({ row }) => {
    return await request({
      url: `/authority/opt_logs/${row.id}`,
      method: 'delete',
    });
  };
  return {
    crudOptions: {
      request: {
        pageRequest,
        delRequest,
      },
      table: {
        scroll: { fixed: true },
      },
      rowHandle: {
        width: 150,
        //固定右侧
        fixed: 'right',
        buttons: {
          view: { size: 'small' },
          edit: { show: false },
          remove: { size: 'small' },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          column: { show: false },
        },
        ip: {
          title: 'IP',
          type: 'text',
          column: { show: false },
        },
        location: {
          title: '登录地点',
          type: 'text',
          column: { width: 150 },
        },
        actionMethod: {
          title: '请求方法',
          type: 'text',
          column: { width: 100 },
          search: { show: true },
        },
        httpMethod: {
          title: 'HTTP方式',
          type: 'text',
          column: { width: 90 },
          search: { show: true },
        },
        platform: {
          title: '操作平台',
          type: 'text',
          column: { width: 100 },
          search: { show: true },
        },
        os: {
          title: '操作系统',
          type: 'text',
          column: { width: 100 },
        },
        engine: {
          title: '引擎类型',
          type: 'text',
          column: { width: 100 },
        },
        engineVersion: {
          title: '引擎版本',
          type: 'text',
          column: { width: 100 },
        },
        browser: {
          title: '浏览器',
          type: 'text',
          column: { width: 100 },
        },
        browserVersion: {
          title: '浏览器版本',
          type: 'text',
          column: { width: 160 },
        },
        createdName: {
          title: '操作人',
          type: 'text',
          column: { width: 100 },
        },
        startTime: {
          title: '开始时间',
          type: 'datetime',
          column: { width: 180 },
        },
        finishTime: {
          title: '结束时间',
          type: 'datetime',
          column: { width: 180 },
        },
        consumingTime: {
          title: '消耗时间',
          type: 'text',
          column: { width: 100 },
        },
        description: {
          title: '描述信息',
          type: 'textarea',
          column: { width: 200 },
        },
      },
    },
  };
}
