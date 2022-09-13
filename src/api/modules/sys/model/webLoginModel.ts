export interface LoginPicture {
  userName: string;
  password: string;
  codeId?: string;
  code?: string;
  grant_type?: string;
  client_id?: string;
  client_secret?: string;
  scope?: string;
  rememberMe?: boolean;
}

export interface LoginSms {
  phone: string;
  code: string;
  rememberMe: string;
}
