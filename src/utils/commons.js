// import commonApi from '@/api/Common'
// import dictionaryItemApi from '@/api/DictionaryItem'

export const loadEnums = (codes, enums = {}) => {
  if (typeof (codes) === 'string') {
    codes = [codes]
  }

  if (codes && codes.length > 0) {
    // commonApi.enums({ codes: codes }).then(response => {
    //   const res = response.data
    //   for (const code of codes) {
    //     enums[code] = res.data[code]
    //   }
    // })
  }
}

/**
 * 初始化权限服务枚举
 * @param codes
 * @param enums
 */
export const initEnums = (codes, enums = {}) => {
  loadEnums(codes, enums)
}
/**
 * 初始化文件服务枚举
 * @param codes
 * @param enums
 */
export const initFileEnums = (codes, enums = {}) => {
  loadEnums(codes, enums)
}
/**
 * 初始化消息服务枚举
 * @param codes
 * @param enums
 */
export const initMsgsEnums = (codes, enums = {}) => {
  loadEnums(codes, enums)
}


/**
 * 下载方法
 * @param response
 */
export const downloadFile = (response) => {
  const res = response.data
  const type = res.type
  if (type.includes('application/json')) {
    const reader = new FileReader()
    reader.onload = e => {
      if (e.target.readyState === 2) {
        const data = JSON.parse(e.target.result)
        this.$message({
          message: data.msg,
          type: 'warning'
        })
      }
    }
    reader.readAsText(res)
  } else {
    const disposition = response.headers['content-disposition']
    let fileName = '下载文件.zip'
    if (disposition) {
      const respcds = disposition.split(';')
      for (let i = 0; i < respcds.length; i++) {
        const header = respcds[i]
        if (header !== null && header !== '') {
          const headerValue = header.split('=')
          if (headerValue !== null && headerValue.length > 0) {
            if (headerValue[0].trim().toLowerCase() === 'filename') {
              fileName = decodeURI(headerValue[1])
              break
            }
          }
        }
      }
    }
    // 处理引号
    if ((fileName.startsWith("'") || fileName.startsWith('"')) && (fileName.endsWith("'") || fileName.endsWith('"'))) {
      fileName = fileName.substring(1, fileName.length - 1)
    }

    const blob = new Blob([res])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    window.URL.revokeObjectURL(link.href)
  }
}
