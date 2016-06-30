zepto.page文档
-
基于zepto.js专注于移动端页面滑动的的插件

属性
-
zepto.page支持自定义参数，每个参数都有默认值，调用如下

	$('.xx').Page({
		pageSelector: '.page',
		duration: 500,
		dir: 0, 
		drag: false,
		deltaTimes: 0.1,
		pageWillHandle: function (data) {},
		pagingHandle: function (data) {},
		pageDidHandle: function (data) {}
	})

####pageSelector
页选择器

type: **String**  
default: **'.page'** 

####duration
页切换时间，在这段时间内，页不能进行切换，单位毫秒

type: **Number**  
default: **500** 

####dir
切换方向，0代表垂直方向，1代表水平方向

type: **Number**  
default: **0** 

####drag
是否拖拽

type: **Boolean**  
default: **false** 

####deltaTimes
滑动距离和当前页面的高/宽比例

type: **Number**  
default: **0.1** 

#### pageWillHandle、pagingHandle、pageDidHandle
滑动过程中各个阶段的回调函数，只执行1次

**pageWillHandle：**将要滑动时候调用

**pagingHandle：**滑动时调用

**pageDidHandle：**滑动结束后调用 

方法
-
维护zepto.page内部状态，方法列表如下

* setState
* initEvent
* movePagePosition
* move
* getMoveDelta
* detectPageNumber




