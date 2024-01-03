/*
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2023-12-28 14:49:36
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2023-12-28 15:29:15
 * @FilePath: \react-event\src\my-react\createElement.js
 */
/**
 *
 * @param {*} type div
 * @param {*} config  props {}
 * @param {*} children  子元素
 */

export function createElement(type, config, children) {
  const props = {};
  for (let key in config) {
    props[key] = config[key];
  }

  // children
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    props.children = Array.prototype.slice.call(arguments, 2);
  }

  return {
    type,
    props,
  };
}
