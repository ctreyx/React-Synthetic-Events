/*
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2023-12-28 17:21:39
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-01-02 15:10:26
 * @FilePath: \react-event\src\my-react\SimpleEventPlugin.js
 */

import { registerTwoPhaseEvent } from "./EventRegistry.js";
import { SyntheticMouseEvent } from "./SyntheticEvent.js";
import { accumulateSinglePhaseListeners } from "./DOMPluginEventSystem.js";
//简单事件插件

//两两成对的事件
const discreteEventPairsForSimpleEventPlugin = [
  "click",
  "click",
  "dblclick",
  "doubleClick",
];

/**
 * 顶级事件名字转换成react事件名字
 */

export const topLevelEventsToReactNames = new Map();

/**
 * 注册简单事件
 * 原版是从DOMEventProperties导入
 */
const registerSimpleEvents = () => {
  //注册事件
  for (let i = 0; i < discreteEventPairsForSimpleEventPlugin.length; i += 2) {
    let topEvent = discreteEventPairsForSimpleEventPlugin[i]; // dblclick
    const event = discreteEventPairsForSimpleEventPlugin[i + 1]; // doubleClick

    const capitalizedEvent = event[0].toUpperCase() + event.slice(1); //首字母大写 DoubleClick
    const reactName = "on" + capitalizedEvent; //react绑定的事件名字 onDoubleClick

    //顶级事件做映射 click=>onClick
    topLevelEventsToReactNames.set(topEvent, reactName);

    // 注册两个阶段事件 捕获 冒泡
    registerTwoPhaseEvent(reactName, [topEvent]);
  }
};

//提取插件事件
const extractEvent = (
  dispatchQueue, // 由插件填充数组
  domEventName,
  targetInst,
  nativeEvent,
  nativeEventTarget,
  eventSystemFlags,
  targetContainer
) => {
  // 事件处理名字
  const reactName = topLevelEventsToReactNames.get(domEventName); //click --> onClick
  let SyntheticEventCtor = null;
  let reactEventType = domEventName;

  //不同事件的合成事件是不同的
  switch (domEventName) {
    case "click":
      SyntheticEventCtor = SyntheticMouseEvent;
      break;
    case "dblclick":
      SyntheticEventCtor = SyntheticMouseEvent;
      break;
    default:
      break;
  }
  //判断是不是捕获阶段,不等于0是捕获，等于0是冒泡
  let inCapturePhase = (eventSystemFlags & 4) !== 0;

  const listeners = accumulateSinglePhaseListeners(
    targetInst,
    reactName,
    nativeEvent.type,
    inCapturePhase
  );

  if (listeners.length > 0) {
    //如果有监听，创建新的合成事件对象
    const event = new SyntheticEventCtor(
      reactName,
      reactEventType,
      targetInst,
      nativeEvent,
      nativeEventTarget
    );
    dispatchQueue.push({
      event,
      listeners,
    });
  }
};

export { registerSimpleEvents as registerEvents, extractEvent };
