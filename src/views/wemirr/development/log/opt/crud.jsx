import { request } from '/src/api/service';
import { compute } from '@fast-crud/fast-crud';

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
  return {
    crudOptions: {
      request: {
        pageRequest,
      },
      table: {
        scroll: { fixed: true },
      },
      actionbar: {
        show: true,
        buttons: {
          add: {
            show: false,
          },
        },
      },
      rowHandle: {
        width: 80,
        //固定右侧
        fixed: 'right',
        buttons: {
          view: { size: 'small' },
          edit: { show: false },
          remove: { size: 'small', show: false },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          column: { show: false },
          viewForm: { show: false },
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
          search: { show: false },
          column: { width: 200 },
          form: {
            show: compute((context) => {
              // grid跨列模式下使用flex模式的设置会显示异常，为了演示效果，在grid模式下隐藏
              return context.form.display !== 'grid';
            }),
            col: { span: 24 }, // flex模式跨列配置
            labelCol: { span: 2 }, // antdv 跨列时，需要同时修改labelCol和wrapperCol
            wrapperCol: { span: 21 },
          },
        },
      },
      form: {
        display: 'flex',
        group: {
          type: 'collapse', // tab
          accordion: false, //手风琴模式
          groups: {
            baseInfo: {
              header: '基础信息',
              columns: ['ip', 'location'],
            },
            reqInfo: {
              header: '请求信息',
              columns: ['actionMethod', 'httpMethod', 'platform', 'os', 'engine', 'browser'],
            },
            version: {
              header: '版号信息',
              columns: ['engineVersion', 'browserVersion'],
            },
            otherInfo: {
              header: '其它信息',
              collapsed: false, //默认折叠
              columns: ['startTime', 'finishTime', 'consumingTime', 'createdName', 'description'],
            },
          },
        },
      },
    },
  };
}
