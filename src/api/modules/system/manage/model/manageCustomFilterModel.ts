export interface ManageSpecialUrlVo {
  urlName: string;
  urlDescribe: string;
  urlType: number;
  specialUrlType: number;
  specialStatus: number;
  limitMethod: boolean;
  requestMethod: string;
  url: string;
  remark: string;
}

export interface ManageCustomFilterVo {
  serviceId: string;
  filterName: string;
  filterTypeName: string;
  filterType: string;
  remark: string;
  filterStatus: number;
  haveSpecial: number;
  specialUrls: ManageSpecialUrlVo[];
}

export interface ManageSpecialUrlDto {
  specialUrlId: string;
  customFilterId: string;
  urlName: string;
  urlDescribe: string;
  specialUrlType: number;
  urlType: string;
  specialStatus: number;
  limitMethod: number;
  requestMethod: string;
  url: string;
  enableDelete: number;
  remark: string;
}

export interface ManageCustomFilterSimpleDto {
  customFilterId: string;
  serviceId: string;
  filterName: string;
  filterTypeName: string;
  filterType: string;
  filterStatus: number;
  haveSpecial: number;
  remark: string;
  createUserName: string;
  createTime: string;
}

export interface ManageCustomFilterDetailDto extends ManageCustomFilterSimpleDto {
  specialUrls: ManageSpecialUrlDto[];
}

export interface ManageCustomFilterListDto extends ManageCustomFilterSimpleDto {
  whiteSpecialUrls: ManageSpecialUrlDto[];
  blackSpecialUrls: ManageSpecialUrlDto[];
}
