import { request } from '/src/api/service';

export default function ({ expose }) {
  const pageRequest = async (query) => {
    return await request({
      url: '/authority/login_logs',
      method: 'get',
      params: query,
    }).then((ret) => {
      return ret.data;
    });
  };
  return {
    crudOptions: {
      request: {
        pageRequest,
      },
      rowHandle: {
        width: 70,
        //固定右侧
        fixed: 'right',
        buttons: {
          view: { size: 'small' },
          edit: { size: 'small', show: false },
          remove: { size: 'small', show: false },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          column: { show: false },
        },
        principal: {
          title: '登录账号',
          type: 'text',
          search: { show: true },
        },
        name: {
          title: '名称',
          column: { show: false },
        },
        ip: {
          title: 'IP',
          type: 'text',
          column: { show: false, width: 160 },
        },
        location: {
          title: '登录地点',
          type: 'text',
          column: { width: 100 },
        },
        clientId: {
          title: '应用标识',
          type: 'text',
          column: { width: 100 },
        },
        platform: {
          title: '操作平台',
          type: 'text',
          column: { width: 100 },
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

        createdTime: {
          title: '创建时间',
          type: 'datetime',
          addForm: { show: false },
        },
      },
    },
  };
}
