/*
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2023-12-28 15:29:59
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2023-12-29 14:24:37
 * @FilePath: \react-event\src\my-react\render.js
 */
import { listenToAllSupportedEvents } from "./DOMPluginEventSystem";
import { HostComponent } from "./ReactWorkTags";
import { internalInstanceKey, internalPropsKey } from "./ReactDomComponentTree";

export function render(vdom, container) {
  //-->事件池
  listenToAllSupportedEvents(container);
  mount(vdom, container);
}

function mount(vdom, container) {
  const dom = createDOM(vdom, container);
  container.appendChild(dom);
}

function createDOM(vdom, parentDom) {
  const { type, props } = vdom;

  let dom;

  //  1.文本节点
  if (typeof vdom === "string" || typeof vdom === "number") {
    dom = document.createTextNode(vdom);
  } else {
    dom = document.createElement(type);
  }
  //父fiber
  let returnFiber = parentDom[internalInstanceKey] || null;
  // fiber
  let fiber = { tag: HostComponent, type, stateNode: dom, return: returnFiber };
  dom[internalInstanceKey] = fiber; //构建fiber树
  dom[internalPropsKey] = props; // 存放属性 onClick

  //  2.处理属性
  if (props) {
    updateProps(dom, {}, props);

    //  3.处理子节点
    if (props.children && Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    } else if (props.children) {
      mount(props.children, dom);
    }
  }

  return dom;
}

function updateProps(dom, oldProps, newProps) {
  for (let key in newProps) {
    if (key === "children") continue;
    if (key === "style") {
      const styleObj = newProps[key];
      for (let attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (key.startsWith("on")) {
      //  事件处理
      //   addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
    } else {
      dom[key] = newProps[key];
    }
  }
}

function reconcileChildren(childrenVdom, parentDom) {
  for (let i = 0; i < childrenVdom.length; i++) {
    const childVdom = childrenVdom[i];
    mount(childVdom, parentDom);
  }
}
