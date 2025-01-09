import type {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
  UserPageQuery,
  UserPageRes,
} from '@fast-crud/fast-crud';

import _ from 'lodash-es';

import { formSchemasToFastCrud } from '#/plugin/fast-ep/setup-fast-crud-helper';

import * as api from './api';

/**
 * 异步创建options
 * @param props
 */
export default async function crud(
  props: CreateCrudOptionsProps,
): Promise<CreateCrudOptionsRet> {
  const { crudExpose, context } = props;
  const { definitionKey } = context;
  const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => {
    query.definitionKey = definitionKey;
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }: EditReq) => {
    if (form.id === null) {
      form.id = row.id;
    }
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }: DelReq) => {
    return await api.DelObj(row.id);
  };

  const addRequest = async ({ form }: AddReq) => {
    return await api.AddObj(form);
  };

  const localCrudOptions = {
    request: {
      pageRequest,
      addRequest,
      editRequest,
      delRequest,
    },
    table: {
      scroll: { fixed: true },
    },
    columns: {
      definitionKey: {
        title: '业务组标识',
        type: 'text',
        search: { show: true },
        column: { show: false, width: 200 },
        form: { show: false, value: definitionKey },
      },
    },
  };
  // 上面是本地crudOptions

  // 下面从后台获取crudOptions
  const remoteCrudOptions = await api.getDetail(definitionKey).then((ret) => {
    return formSchemasToFastCrud(ret?.formSchemas);
  });
  const crudOptions = _.merge(localCrudOptions, remoteCrudOptions);
  return {
    crudOptions,
  };
}
