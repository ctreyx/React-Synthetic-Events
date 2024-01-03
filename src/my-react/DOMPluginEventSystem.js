/*
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2023-12-28 16:58:41
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-01-02 17:10:46
 * @FilePath: \react-event\src\my-react\DOMPluginEventSystem.js
 */
// 事件插件系统

import { allNativeEvents } from "./EventRegistry.js";
import * as SimpleEventPlugin from "./SimpleEventPlugin.js";
import { getEventListenerSet } from "./ReactDomComponentTree.js";
import {
  addEventCaptureListener,
  addEventBubbledEventListener,
} from "./eventListener.js";
import { dispatchEvent } from "./ReactDomEventListener.js";
import { HostComponent } from "./ReactWorkTags.js";
import getListener from "./getListener.js";
// 注册事件名称，核心作用是给allNativeEvents添加事件

SimpleEventPlugin.registerEvents();

//有些事件不需要冒泡(false)，只有捕获阶段(true)
export const nonDelegatedEvents = new Set(["scroll"]);

export function accumulateSinglePhaseListeners(
  targetFiber,
  reactName,
  nativetype,
  inCapturePhase
) {
  // 捕获事件名字
  const captureName = reactName + "Capture"; //onClickCapture
  const reactEventName = inCapturePhase ? captureName : reactName;

  const listeners = [];
  let instance = targetFiber;
  let lastHostComponent = null;

  while (instance) {
    //stateNode dom节点 tag类型
    const { stateNode, tag } = instance;

    //只有原生组件可以挂事件 , 组件不能挂
    if (tag === HostComponent && stateNode !== null) {
      lastHostComponent = stateNode;

      const listener = getListener(instance, reactEventName);

      if (listener) {
        listeners.push(
          createDispatchListener(instance, listener, lastHostComponent)
        );
      }
    }

    instance = instance.return;
  }

  return listeners;
}

//创建派发监听
function createDispatchListener(instance, listener, lastHostComponent) {
  return {
    instance,
    listener,
    lastHostComponent,
  };
}

/**
 * 事件派发系统
 * @param {*} domEventName
 * @param {*} eventSystemFlags
 * @param {*} nativeEvent
 * @param {*} targetInst
 * @param {*} targetContainer
 */

export function dispatchEventForPluginEventSystem(
  domEventName,
  eventSystemFlags,
  nativeEvent,
  targetInst,
  targetContainer
) {
  // 将事件派发给插件
  const nativeEventTarget = nativeEvent.target;
  const dispatchQueue = [];

  //提取队列
  SimpleEventPlugin.extractEvent(
    dispatchQueue, // 由插件填充数组
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer
  );

  // console.log("dispatchQueue", dispatchQueue);

  //处理派发队列
  processDispatchQueue(dispatchQueue, eventSystemFlags);
}

function processDispatchQueue(dispatchQueue, eventSystemFlags) {
  //判断是不是捕获
  const isCapturePhase = (eventSystemFlags & 4) !== 0;

  for (let i = 0; i < dispatchQueue.length; i++) {
    const { event, listeners } = dispatchQueue[i];

    processDispatchQueueItemsInOrder(event, listeners, isCapturePhase);
  }
}

function processDispatchQueueItemsInOrder(event, listeners, isCapturePhase) {
  //捕获倒序
  if (isCapturePhase) {
    for (let i = listeners.length - 1; i >= 0; i--) {
      const { currentTarget, listener } = listeners[i];
      // 阻止捕获
      if (event.isDefaultPrevented()) {
        return;
      }
      execDispatch(event, listener, currentTarget);
    }
  } else {
    // 冒泡正序
    for (let i = 0; i < listeners.length; i++) {
      const { currentTarget, listener } = listeners[i];
      // 阻止冒泡
      if (event.isPropagationStopped()) {
        return;
      }
      execDispatch(event, listener, currentTarget);
    }
  }
}

function execDispatch(event, listener, currentTarget) {
  try {
    event.currentTarget = currentTarget;
    listener(event);
  } catch (error) {
    console.log("error", error);
  } finally {
    event.currentTarget = null;
  }
}

/**
 * 监听所有绑定的插件
 */
export function listenToAllSupportedEvents(container) {
  //事件插件注册完后，会在此循环绑定到容器root
  allNativeEvents.forEach((domEventName) => {
    if (!nonDelegatedEvents.has(domEventName)) {
      //如果不是某些特定事件，需要监听冒泡阶段
      listenToNativeEvent(domEventName, false, container);
    }

    // 监听捕获
    listenToNativeEvent(domEventName, true, container);
  });
}

/**
 *
 * @param {*} domEventName  事件名称
 * @param {*} isCapturePhaseListener  是否捕获阶段 true 捕获 false 冒泡
 * @param {*} container
 * @param {*} eventSystemFlags 事件标识 默认0 冒泡
 */

function listenToNativeEvent(
  domEventName,
  isCapturePhaseListener,
  container,
  eventSystemFlags = 0
) {
  //1.同一个容器，同一个事件，只能绑定一次
  const listenerSet = getEventListenerSet(container);

  let listenerSetKey = getListenerSetKey(domEventName, isCapturePhaseListener);

  if (!listenerSet.has(listenerSetKey)) {
    // 捕获阶段
    if (isCapturePhaseListener) {
      eventSystemFlags |= 4;
    }

    addTrappedEventListener(
      container,
      domEventName,
      eventSystemFlags,
      isCapturePhaseListener
    );

    listenerSet.add(listenerSetKey);
  }
}

function addTrappedEventListener(
  container,
  domEventName,
  eventSystemFlags,
  isCapturePhaseListener
) {
  //前3个参数绑死，最后一个nativeEvent
  let listener = dispatchEvent.bind(
    null,
    domEventName,
    eventSystemFlags,
    container
  );

  if (isCapturePhaseListener) {
    //捕获监听
    addEventCaptureListener(container, domEventName, listener);
  } else {
    // 冒泡监听
    addEventBubbledEventListener(container, domEventName, listener);
  }
}

// true捕获 false冒泡
function getListenerSetKey(domEventName, isCapturePhaseListener) {
  //click_capture
  return `${domEventName}__${isCapturePhaseListener ? "capture" : "bubble"}`;
}
