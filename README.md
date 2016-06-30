zepto.page
-
基于zepto.js专注于移动端页面滑动的的插件

概述
-
* 移动端单页滑动效果
* 支持拖拽滑动
* 支持滑动各阶段处理函数
* 源码轻量且易读
* 详细API文档
* 详细开发原理文档(待发布)

快速上手
-
###HTML
	<div class="page-container">
		<div class="page-inner">
			<div class="page page1"></div>
			<div class="page page2"></div>
			<div class="page page3"></div>
		</div>
	</div>

###CSS

	.page-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
     }

###JS
	$('.page-inner').Page({
        drag: true
    });

文档
-

[API](./doc/api.md)