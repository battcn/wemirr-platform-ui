import { ManageCustomFilterSimpleDto } from './manageCustomFilterModel';
export interface ManageRoutePredicateDto {
  predicateId: string;
  serviceId: string;
  routeId: string;
  predicateType: string;
  predicateTypeName: string;
  rules: string;
  enableDelete: number;
  remark: string;
  predicateName: string;
}

export interface ManageRouteFilterDto {
  filterId: string;
  serviceId: string;
  filterType: string;
  filterTypeName: string;
  rules: string;
  enableDelete: number;
  remark: string;
  routeId: string;
  filterName: string;
}

export interface ManageRouteDto {
  routeId: string;
  routeCode: string;
  routeName: string;
  url: string;
  serviceId: string;
  serviceCode: string;
  enableDelete: string;
  serviceName: string;
  disableServiceFilter: boolean;
  isLoadBalancer: string;
  metadata: string;
  loadBalancerType: string;
  routeOrder: string;
  routeState: string;
  remark: string;
  createUserName: string;
  createTime: string;
  routeFilters: ManageRouteFilterDto[];
  routePredicates: ManageRoutePredicateDto[];
  customFilterIds: string[];
  customFilters: ManageCustomFilterSimpleDto[];
}

export interface ManageRoutePredicateVo {
  predicateType: string;
  predicateName: string;
  rules: string;
  enableDelete: string;
  remark: string;
}

export interface ManageRouteFilterVo {
  filterType: string;
  filterName: string;
  filterStatus: number;
  rules: string;
  enableDelete: number;
  remark: string;
}

export interface ManageRouteVo {
  routeCode: string;
  serviceId: string;
  routeName: string;
  isLoadBalancer: number;
  url: string;
  loadBalancerType: string;
  customFilterType: number;
  metadataJson: string;
  serviceName: string;
  routeOrder: number;
  enableDelete: number;
  routeState: number;
  remark: string;
  routeFilters: ManageRouteFilterVo[];
  routePredicates: ManageRoutePredicateVo[];
  customFilterIds: string[];
}
