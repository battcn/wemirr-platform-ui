/**
 * 分页请求基本参数
 */
export interface BasePageVo {
  current: number;
  size: number;
  descs?: string[];
  ascs?: string[];
  startTime?: string;
  endTime?: string;
}

/**
 *分页响应基本类型(BasicResult中的data)
 */
export interface PageDto<T> {
  records?: T[];
  total: number;
}

/**
 * 响应基本类型
 */
export interface Result<T> {
  code: number;
  success: boolean;
  message?: string;
  data?: T;
  timestamp: number;
}
