import { getClosestPropsFromNode } from "./ReactDomComponentTree";

export default function getListener(instance, reactEventName) {
  // 拿到实例身上的事件

  const stateNode = instance.stateNode;
  const props = getClosestPropsFromNode(stateNode);
  const listener = props[reactEventName];

  return listener;
}
