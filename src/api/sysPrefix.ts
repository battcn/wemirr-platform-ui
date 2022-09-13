/**
 * 系统前缀标识(方便单体与微服务转换)
 * 当变为单体时直接全部空值，由axios提供的一级前缀
 * 当变为微服务时axios提供的一级前缀(网关),此处提供二级前缀(服务)
 */
export const enum SysUrlPrefix {
  AUTH = '/authority', // 权限管理系统
  GEN = '/gen', // 代码生成系统
  JOB = '/jog', // 调度系统
  LOGGING = '/logging', // 日志系统
  MESSAGE = '/message', // 消息系统
  PROCESS = '/process', // 流程系统
  STORAGE = '/storage', // 存储系统
  SYSTEM = '/system', // 基础系统
  TOOLS = '/tools', // 工具系统
}
