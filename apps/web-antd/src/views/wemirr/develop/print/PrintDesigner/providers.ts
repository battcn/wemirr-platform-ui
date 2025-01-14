// 很神奇 ES 格式化后 Table 就没法用了
/* eslint-disable */
import { hiprint } from 'vue-plugin-hiprint';

// 自定义设计元素1
export const wmsProvider = function (ops) {
  var addElementTypes = function (context) {
    context.removePrintElementTypes("wmsProviderModule");
    context.addPrintElementTypes(
      "wmsProviderModule",
      [
        new hiprint.PrintElementTypeGroup("平台", [
          {
            tid: 'wmsProviderModule.header', title: '单据表头', data: '单据表头', type: 'text',
            options: {
              testData: '单据表头',
              height: 17,
              fontSize: 16.5,
              field: "headera",
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          {
            tid: 'wmsProviderModule.type', title: '单据类型', data: '单据类型', type: 'text',
            options: {
              testData: '单据类型',
              height: 16,
              fontSize: 15,
              field: "textType",
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          {
            tid: 'wmsProviderModule.order', title: '订单编号', data: 'XS888888888', type: 'text',
            options: {
              field: 'orderId',
              testData: 'XS888888888',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'wmsProviderModule.date', title: '业务日期', data: '2020-01-01', type: 'text',
            options: {
              field: 'date',
              testData: '2020-01-01',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'wmsProviderModule.barcode', title: '条形码', data: 'XS888888888', type: 'text',
            options: {
              field: 'barcode',
              testData: 'XS888888888',
              height: 32,
              fontSize: 12,
              lineHeight: 18,
              textType: "barcode"
            }
          },
          {
            tid: 'wmsProviderModule.qrcode', title: '二维码', data: 'XS888888888', type: 'text',
            options: {
              field: 'qrcode',
              testData: 'XS888888888',
              height: 32,
              fontSize: 12,
              lineHeight: 18,
              textType: "qrcode"
            }
          },
          {
            tid: 'wmsProviderModule.platform', title: '平台名称', data: '平台名称', type: 'text',
            options: {
              testData: '平台名称',
              height: 17,
              fontSize: 16.5,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          // {tid: 'wmsProviderModule.logo', title: 'Logo', data: '', type: 'image'},
        ]),
        new hiprint.PrintElementTypeGroup("库管", [
          {
            tid: 'wmsProviderModule.creater', title: '制单人', data: '李四', type: 'text',
            options: {
              field: 'creater',
              testData: '李四',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'wmsProviderModule.printDate', title: '打印时间', data: '2022-01-01 09:00', type: 'text',
            options: {
              field: 'printDate',
              testData: '2022-01-01 09:00',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'wmsProviderModule.signer', title: '库管签字', data: '', type: 'text',
            options: {
              title: '库管签字：',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
        ]),
        new hiprint.PrintElementTypeGroup("表格/其他", [
          {
            tid: 'wmsProviderModule.table', title: '订单数据',
            type: 'table',
            options: {
              field: 'table',
              tableHeaderRepeat: 'first',
              tableFooterRepeat: 'last',
              fields: [
                {text: '名称', field: 'NAME'},
                {text: '数量', field: 'SL'},
                {text: '规格', field: 'GG'},
                {text: '条码', field: 'TM'},
                {text: '单价', field: 'DJ'},
                {text: '金额', field: 'JE'},
              ],
            },
            editable: true,
            columnDisplayEditable: true,//列显示是否能编辑
            columnDisplayIndexEditable: true,//列顺序显示是否能编辑
            columnTitleEditable: true,//列标题是否能编辑
            columnResizable: true, //列宽是否能调整
            columnAlignEditable: true,//列对齐是否调整
            isEnableEditField: true, //编辑字段
            isEnableContextMenu: true, //开启右键菜单 默认true
            isEnableInsertRow: true, //插入行
            isEnableDeleteRow: true, //删除行
            isEnableInsertColumn: true, //插入列
            isEnableDeleteColumn: true, //删除列
            isEnableMergeCell: true, //合并单元格
            columns: [
              [
                {title: '名称', align: 'center', field: 'NAME', width: 150},
                {title: '数量', align: 'center', field: 'SL', width: 80},
                {title: '规格', align: 'center', field: 'GG', width: 80, checked: false},
                {title: '条码', align: 'center', field: 'TM', width: 100, checked: false},
                {title: '单价', align: 'center', field: 'DJ', width: 100},
                {title: '金额', align: 'center', field: 'JE', width: 100, checked: false},
              ],
            ],
            rowsColumnsMerge: function (data, col, index) {
              // 返回一个数组,参数一为行（rowspan）合并数,参数二为列（colspan）合并数, 被合并的行或者列值设为0
              if (index == 0) {
                return [1, data.INDEX % 2 == 1 ? 2 : 1]
              } else if (index > 0 && index < 2) {
                return [data.INDEX % 2 == 1 ? 0 : 1, 1]
              } else {
                return [data.INDEX % 2 == 1 ? 2 : 0, 1]
              }
            },
            footerFormatter: function (options, rows, data, currentPageGridRowsData) {
              if (data && data['totalCap']) {
                return `<td style="padding:0 10px" colspan="100">${'应收金额大写: ' + data['totalCap']}</td>`
              }
              return '<td style="padding:0 10px" colspan="100">应收金额大写: </td>'
            },
          },
        ]),
      ]
    );
  };
  return {
    addElementTypes: addElementTypes
  };
};

// 自定义设计元素2
export const tmsProvider = function (ops) {
  var addElementTypes = function (context) {
    context.removePrintElementTypes("tmsProviderModule");
    context.addPrintElementTypes(
      "tmsProviderModule",
      [
        new hiprint.PrintElementTypeGroup("常规", [
          {
            tid: 'tmsProviderModule.header', title: '单据表头', data: '单据表头', type: 'text',
            options: {
              testData: '单据表头',
              height: 17,
              fontSize: 16.5,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          {
            tid: 'tmsProviderModule.type', title: '单据类型', data: '单据类型', type: 'text',
            options: {
              testData: '单据类型',
              height: 16,
              fontSize: 15,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          {
            tid: 'tmsProviderModule.order', title: '订单编号', data: 'XS888888888', type: 'text',
            options: {
              field: 'orderId',
              testData: 'XS888888888',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'tmsProviderModule.date', title: '业务日期', data: '2020-01-01', type: 'text',
            options: {
              field: 'date',
              testData: '2020-01-01',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'tmsProviderModule.barcode', title: '条形码', data: 'XS888888888', type: 'text',
            options: {
              field: 'barcode',
              testData: 'XS888888888',
              height: 32,
              fontSize: 12,
              lineHeight: 18,
              textType: "barcode"
            }
          },
          {
            tid: 'tmsProviderModule.qrcode', title: '二维码', data: 'XS888888888', type: 'text',
            options: {
              field: 'qrcode',
              testData: 'XS888888888',
              height: 32,
              fontSize: 12,
              lineHeight: 18,
              textType: "qrcode"
            }
          },
          {
            tid: 'tmsProviderModule.platform', title: '平台名称', data: '平台名称', type: 'text',
            options: {
              testData: '平台名称',
              height: 17,
              fontSize: 16.5,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          // {tid: 'tmsProviderModule.image', title: 'Logo', data: '', type: 'image'},
        ]),
        new hiprint.PrintElementTypeGroup("客户", [
          {
            tid: 'tmsProviderModule.khname', title: '客户名称', data: '高级客户', type: 'text',
            options: {
              field: 'name',
              testData: '高级客户',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'tmsProviderModule.tel', title: '客户电话', data: '18888888888', type: 'text',
            options: {
              field: 'tel',
              testData: '18888888888',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
        ])
      ]
    );
  };
  return {
    addElementTypes: addElementTypes
  };
};

// type: 1供货商 2经销商
export default [{
  name: '仓储管理',
  value: 'wmsProviderModule',
  type: 1,
  f: wmsProvider()
}, {
  name: '运输管理',
  value: 'tmsProviderModule',
  type: 2,
  f: tmsProvider()
}]
