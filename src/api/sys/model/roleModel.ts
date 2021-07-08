export interface GetPermissionListModel {
  resIdList: any[];
  buttons?: ButtonTable[];
}
export interface ButtonTable {
  id: number;
  name?: string;
  permission?: string;
  type?: number;
}
