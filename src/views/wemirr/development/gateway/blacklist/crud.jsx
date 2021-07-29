import _ from 'lodash-es';
import * as api from './api';
import { dict, utils } from '@fast-crud/fast-crud';
import moment from 'moment';

export default function ({ expose, localDataRef }) {
  const pageRequest = async (query) => {
    //总数据
    let data = localDataRef.value;
    let current = query.current;
    let offset = query.offset;
    let size = query.size;
    data = data.filter((item) => {
      if (query.status && item.status !== query.status) {
        return false;
      }
      if (query.ip && item.ip.indexOf(query.ip) === -1) {
        return false;
      }
      if (query.method && item.method.indexOf(query.method) === -1) {
        return false;
      }
      if (query.path && item.path.indexOf(query.path) === -1) {
        return false;
      }
      return true;
    });

    // 本地分页
    const start = offset;
    let end = offset + size;
    if (data.length < end) {
      end = data.length;
    }
    const records = data.slice(start, end);

    // 构造返回结果
    return {
      current,
      offset,
      size,
      total: localDataRef.value.length,
      records,
    };
  };
  const editRequest = async ({ form, row }) => {
    form.id = row.id;
    await api.UpdateObj(form);
    //更新本地数据
    const tableData = localDataRef.value;
    for (const item of tableData) {
      if (item.id === form.id) {
        _.merge(item, form);
      }
    }
  };

  const addRequest = async ({ form }) => {
    const id = await api.AddObj(form);
    //本地添加
    form.id = id;
    localDataRef.value.unshift(form);
    return id;
  };

  const delRequest = async ({ row }) => {
    await api.DelObj(row.id);
    //本地删除那一条记录
    const tableData = localDataRef.value;
    let index = 0;
    for (const item of tableData) {
      if (item.id === row.id) {
        localDataRef.value.splice(index, 1);
      }
      index++;
    }
  };

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      columns: {
        ip: {
          title: 'IP',
          type: 'text',
          search: { show: true },
        },
        status: {
          title: '状态',
          type: 'dict-radio',
          addForm: {
            value: true,
          },
          search: { show: true },
          dict: dict({
            data: [
              { value: true, label: '启用', color: 'success' },
              { value: false, label: '禁用', color: 'error' },
            ],
          }),
        },
        visits: {
          title: '访问量',
          type: 'text',
          form: { show: false },
        },
        path: {
          title: '路径',
          type: 'text',
          search: { show: true },
          form: {
            helper: {
              render() {
                return (
                  <ul>
                    <li>（1）? 匹配一个字符（除过操作系统默认的文件分隔符）</li>
                    <li>（2）* 匹配0个或多个字符 </li>
                    <li>（3）**匹配0个或多个目录 </li>
                    <li>
                      （4）{'{spring:[a-z]+}'} 将正则表达式[a-z]+匹配到的值,赋值给名为 spring
                      的路径变量
                    </li>
                  </ul>
                );
              },
            },
          },
          column: {
            ellipsis: true,
          },
        },
        method: {
          title: '方法',
          type: 'dict-select',
          search: { show: true },
          dict: dict({
            data: [
              { label: 'ALL', value: 'ALL', color: 'success' },
              { label: 'GET', value: 'GET', color: 'success' },
              { label: 'POST', value: 'POST', color: 'success' },
              { label: 'PUT', value: 'PUT', color: 'success' },
              { label: 'DELETE', value: 'DELETE', color: 'error' },
              { label: 'PATCH', value: 'PATCH', color: 'success' },
            ],
          }),
          addForm: {
            value: 'ALL',
          },
          form: {
            rules: [{ required: true, message: '请选择拦截方法' }],
          },
        },
        datetimerange: {
          title: '限时范围',
          type: 'datetimerange',
          valueBuilder({ row, key }) {
            if (!utils.strings.hasEmpty(row.startTime, row.endTime)) {
              row[key] = [moment(row.startTime), moment(row.endTime)];
            }
          },
          valueResolve({ form, key }) {
            const row = form;
            if (row[key] != null && !utils.strings.hasEmpty(row[key])) {
              row.startTime = row[key][0];
              row.endTime = row[key][1];
            } else {
              row.startTime = null;
              row.endTime = null;
            }
          },
        },
        description: {
          title: '描述',
          type: 'textarea',
          search: { show: false, labelCol: { span: 4 } },
          form: {
            col: { span: 24 },
            labelCol: { span: 2 },
            wrapperCol: { span: 21 },
          },
          column: {
            ellipsis: true,
          },
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
