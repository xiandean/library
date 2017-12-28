function getDefaultStyle (el, attribute) { // 返回最终样式函数，兼容IE和DOM，设置参数：元素对象、样式特性
  return el.currentStyle ? el.currentStyle[attribute] : document.defaultView.getComputedStyle(el, false)[attribute]
}
