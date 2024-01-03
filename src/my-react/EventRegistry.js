/*
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2023-12-28 17:03:59
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-01-02 14:44:26
 * @FilePath: \react-event\src\my-react\EventRegistry.js
 */

//时间注册中心，放所有事件
export const allNativeEvents = new Set();
export const registrationNameDependencies = {};

/**
 * 注册两个阶段事件,react会把很多原生事件合成一个事件
 * 例如 input keydown change => onchange
 * onchange [input keydown change]
 * @param {*} registertionName  注册名称
 * @param {*} dependcencies  依赖的事件  原生事件
 */

export const registerTwoPhaseEvent = (registertionName, dependcencies) => {
  registerDirectEvent(registertionName, dependcencies); // onClick

  registerDirectEvent(registertionName + "Capture", dependcencies); // onClickCapture
 
};

//注册 捕获 冒泡事件
export function registerDirectEvent(registertionName, dependcencies) {
  registrationNameDependencies[registertionName] = dependcencies;

  for (let i = 0; i < dependcencies.length; i++) {
    allNativeEvents.add(dependcencies[i]);
  }
}
