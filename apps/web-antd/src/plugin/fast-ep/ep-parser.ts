import { dict } from '@fast-crud/fast-crud';
import _ from 'lodash-es';

export function parserSchema(obj) {
  return findObjectsWithField(obj, 'field');
}
/**
 * 遍历 JSON 对象，提取包含指定字段的所有对象
 * @param {object | Array} obj - 要遍历的 JSON 对象或数组
 * @param {string} field - 要查找的字段
 * @returns {Array} - 包含指定字段的对象数组
 */
export function findObjectsWithField(obj, field) {
  const result = [];
  if (typeof obj === 'string') {
    obj = JSON.parse(obj);
  }
  function traverse(node) {
    if (_.isPlainObject(node)) {
      if (_.has(node, field)) {
        result.push(node);
      }
      // 遍历对象的所有属性
      _.forOwn(node, (value) => traverse(value));
    } else if (_.isArray(node)) {
      // 遍历数组中的每个元素
      _.forEach(node, (item) => traverse(item));
    }
  }
  traverse(obj);
  return result;
}

/**
 * 将输入字段转换为 fast-crud 格式
 * @param {Array} fieldList - 输入的字段列表
 * @returns {object} - 转换后的 fast-crud 对象
 */
export function fieldToFastCrud(fieldList) {
  if (!Array.isArray(fieldList) || fieldList.length === 0) {
    return null;
  }

  const result = {};
  fieldList.forEach((field) => {
    result[field.field] = toFastCrudField(field);
  });
  return result;
}

/**
 * 转换单个字段为 fast-crud 格式
 * @param {object} field - 输入的字段对象
 * @returns {object} - 转换后的字段对象
 */
export function toFastCrudField(field) {
  if (!field || !field.field) {
    throw new Error('Field 不能为空');
  }

  const item = {
    title: field.label,
    search: { show: true },
    column: { show: true, width: 200 },
    type: getType(field),
  };

  const props = field.componentProps;
  if (props && Array.isArray(props.options)) {
    item.dict = dict({ data: props.options });
    item.column.component = { color: 'auto' };
  }
  return item;
}

/**
 * 根据字段类型获取 fast-crud 类型
 * @param {object} field - 输入的字段对象
 * @returns {string} - fast-crud 类型
 */
function getType(field) {
  const typeMap = {
    input: 'text',
    radio: 'dict-radio',
    checkbox: 'dict-checkbox',
    textarea: 'textarea',
    number: 'number',
  };

  return typeMap[field.type] || field.type;
}
