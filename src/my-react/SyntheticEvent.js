/*
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2024-01-02 10:58:31
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-01-02 14:33:28
 * @FilePath: \react-event\src\my-react\SyntheticEvent.js
 */
 

function functionThatReturensTrue() {
  return true;
}

function functionThatReturensFalse() {
  return false;
}

function createSyntheticEvent(Interface) {
  function SyntheticBaseEvent(
    reactName,
    reactEventType,
    targetInstnst,
    nativeEvent,
    nativeEventTarget
  ) {
    this._reactName = reactName;
    this._targetInstnst = targetInstnst;
    this.type = reactEventType;
    this.nativeEvent = nativeEvent;
    this.target = nativeEventTarget;
    this.currentTarget = null;

    //选择性将原生事件属性拷贝到合成实例上
    for (const propName in Interface) {
      this[propName] = Interface[propName];
    }

    this.isDefaultPrevented = functionThatReturensFalse; //是否阻止了默认事件
    this.isPropagationStopped = functionThatReturensFalse; //是否阻止了冒泡

    return this;
  }

  Object.assign(SyntheticBaseEvent.prototype, {
    preventDefault() {
      //做一个兼容处理
      this.defaultPrevented = true;
      const event = this.nativeEvent;
      if (!event) {
        return;
      }
      // 兼容
      if (event.preventDefault) {
        event.preventDefault();
      } else if (typeof event.returnValue !== "unknown") {
        // ie
        event.returnValue = false;
      }
      this.isDefaultPrevented = functionThatReturensTrue;
    },
    stopPropagation() {
      const event = this.nativeEvent;
      if (!event) {
        return;
      }

      // 兼容
      if (event.stopPropagation) {
        event.stopPropagation();
      } else if (typeof event.cancelBubble !== "unknown") {
        // ie
        event.cancelBubble = true;
      }
      this.isPropagationStopped = functionThatReturensTrue;
    },
  });

  return SyntheticBaseEvent;
}

// 鼠标事件接口
const MouseEventInterface = {
  clientX: 0,
  clientY: 0,
};

export const SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface);
export const SyntheticEvent= createSyntheticEvent({});