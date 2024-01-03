/*
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2023-12-29 11:09:10
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-01-02 16:20:16
 * @FilePath: \react-event\src\my-react\ReactDomEventListener.js
 */

import {
  getClosestInstanceFromNode,
 
} from "./ReactDomComponentTree";
import { dispatchEventForPluginEventSystem } from "./DOMPluginEventSystem.js";

/**
 *
 * @param {*} domEventName
 * @param {*} eventSystemFlags
 * @param {*} targetContainer
 * @param {*} nativeEvent  事件真正触发，原生浏览器事件对象
 */

export function dispatchEvent(
  domEventName,
  eventSystemFlags,
  targetContainer,
  nativeEvent
) {
  // console.log("domEventName", domEventName);
  // console.log("nativeEvent", nativeEvent);

  //获取原生事件源
  const target = nativeEvent.target || nativeEvent.srcElement || window;
  //fiber实例
  const targetInst = getClosestInstanceFromNode(target);
  // props
  // const eventProps = getClosestPropsFromNode(target);

  // 派发事件在插件系统
  dispatchEventForPluginEventSystem(
    domEventName,
    eventSystemFlags,
    nativeEvent,
    targetInst,
    targetContainer
  );

 
}
