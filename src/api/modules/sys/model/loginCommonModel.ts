export interface OnlineUserInfoDto {
  email: string;
  name: string;
  introduction: string;
  phone: string;
  address: string;
}

export interface ValidateDto {
  codeValue: string;
  codeType: string;
  validTime: number;
  codeId: string;
}
