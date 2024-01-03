<!--
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2023-12-28 14:35:29
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-01-02 16:27:26
 * @FilePath: \react-event\README.md
-->
<!-- 1.注册事件 -->

1. render 中，会先注册事件 --> listenToAllSupportedEvents --> allNativeEvents 需要遍历所有事件，所以我们需要先为 allNativeEvents 添加事件

2. SimpleEventPlugin.registerEvents 为 allNativeEvents 添加事件 --> registerSimpleEvents 中会将写死的 discreteEventPairsForSimpleEventPlugin 中量量成对的事件添加映射 --> registerTwoPhaseEvent 注册捕获和冒泡

3. registerTwoPhaseEvent --> 注册两个阶段事件,react 会把很多原生事件合成一个事件 , 例如 input keydown change => onchange

# 上述都是为了给 allNativeEvents 添加事件

<!-- 2.绑定事件 -->

1. listenToAllSupportedEvents --> 绑定捕获和冒泡事件 listenToNativeEvent

2. listenToNativeEvent 中会判断同一个容器是否绑定过 getEventListenerSet 函数.

3. addTrappedEventListener --> 绑定事件 dispatchEvent 绑死前三个参数，最后一个原生函数在容器调用的时候传入

addEventCaptureListener 就是给 root 绑定事件。

<!-- 3.渲染事件 -->

1. createDOM 中，构建 fiber,绑定在真实 dom 身上 fiber 与 props,后面触发事件需要获取这些参数.

2. 我们回到 dispatchEvent 方法中，之前绑定了该函数在 root 根上，我们触发事件，就在这里 dispatchEventForPluginEventSystem 通过派发事件插件进行合成事件的执行

<!-- 4.事件队列提取 -->

1. 在 dispatchEventForPluginEventSystem 中，进行 SimpleEventPlugin.extractEvent ，获取当前事件的队列.

2. extractEvent 中，通过当前事件名字，生成不同的合成事件 -- > SyntheticMouseEvent 文件中，会处理合成事件，阻止冒泡捕获逻辑都在这里。

3. accumulateSinglePhaseListeners 开始从事件根往上，拿到每个 fiber 身上绑定的事件。 处理完 --> 通过 SyntheticEventCtor 生成合成事件,添加到 dispatchQueue 队列中。

<!-- 5.派发处理 -->

1. processDispatchQueue 这里处理事件，通过判断是不是捕获冒泡，进行倒序正序执行。
