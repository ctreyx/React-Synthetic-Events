/*
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2023-12-28 14:35:29
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-01-03 09:08:48
 * @FilePath: \react-event\src\index.js
 */
// import React from "react";
import React from "./my-react";
// import ReactDOM from "react-dom/client";
import ReactDOM from "./my-react/react-dom";
import "./index.css";

// const root = ReactDOM.createRoot(document.getElementById("root"));

const handleDivClick = () => {
  console.log("div  click 冒泡");
};

const handleDivClickCapture = (e) => {
  // e.preventDefault();
  // e.stopPropagation();
  console.log("div Capture 捕获");
};

const handleButtonClick = () => {
  console.log("子元素  click 冒泡");
};
const handleButtonClickCapture = () => {
  console.log("子元素 Capture 捕获");
};

const element1 = React.createElement(
  "div",
  {
    onClick: handleDivClick,
    onClickCapture: handleDivClickCapture,
    id: "my-react",
  },
  React.createElement(
    "div",
    {
      onClick: handleButtonClick,
      onClickCapture: handleButtonClickCapture,
    },
    "点击"
  )
);

// root.render(element1);

ReactDOM.render(element1, document.getElementById("root"));

setTimeout(() => {
  const MyReact = document.getElementById("my-react");
  MyReact.addEventListener(
    "click",
    () => {
      console.log("原生click");
    },
    true
  );
}, 1000);
