import { AreaTreeGetResultModel } from '../model/systemModel';
import { defHttp } from '/@/utils/http/axios';

enum Api {
  AreaList = '/authority/areas/trees',
}

export const getAreaTree = () => defHttp.get<AreaTreeGetResultModel>({ url: Api.AreaList });
