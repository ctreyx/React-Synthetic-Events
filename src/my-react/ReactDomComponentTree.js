/*
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2023-12-29 10:28:59
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-01-02 10:31:48
 * @FilePath: \react-event\src\my-react\ReactDomComponentTree.js
 */
const randomKey = Math.random().toString(32).slice(2);
const internalEventHandlersKey = "_reactEvents$" + randomKey;
export const internalInstanceKey = "_reactFiber$" + randomKey;
export const internalPropsKey = "_reactProps$" + randomKey;

//真实节点找fiber
export function getClosestInstanceFromNode(targetNode){
  return targetNode[internalInstanceKey];
}

//真实节点找props
export function getClosestPropsFromNode(targetNode){
  return targetNode[internalPropsKey];
}

export function getEventListenerSet(node) {
  let elementListenerSet = node[internalEventHandlersKey];

  if (elementListenerSet === undefined) {
    elementListenerSet = node[internalEventHandlersKey] = new Set();
  }

  return elementListenerSet;
}
