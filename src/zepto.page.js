/*
 zepto.page.js基于zepto.js的一个页面滑动插件
 轻量、源码易读、Api松耦合
 QQ：461153861
 Copyright 2014 zengwenbin. All Rights Reserved
 MIT
*/

(function ($, root, factory) {
    $.fn.Page = function (options) {
        factory(this, options);
    };
})($ || Zepto, window, function ($, root) {
    'use strict';

    // 默认插件配置
    var defaultOption = {
        pageSelector: '.page',                                          // 页选择器
        duration: 0.5,                                                  // 滑动时间
        dir: 0,                                                         // 滑动方向 -- 0：垂直方向 1：水平方向
        delta: 0.1,                                                     // 滑动距离大于1个值的时候，开启滑动，滑动距离 = delta * 页面高度|页面宽度
        startPosition: 0,                                               // 起始位置停在第几页
        pageWillHandle: function (data) {},                             // 页面开始滑动前处理函数
        pagingHandle: function (data) {},                               // 页面滑动时处理函数
        pageDidHandle: function (data) {}                               // 页面滑动结束处理函数
    };

    function Page ($obj, option) {
        return new Page.fn.init($obj, option);
    }

    $.extend(Page.fn = Page.prototype, {
        init: function ($obj, option) {
            this.$obj = $obj;                                           // 绑定当前zepto对象
            this.option = $.extend({}, defaultOption, option);          // 配置对象
            this.pages = $obj.find(this.options.pageSelector);          // 页集合
            this.pageLength = this.pages.length;                        // 页个数
            this.currentIndex = 0;                                     // 当前索引

            this.setState();
            this.initEvent();
        },

        setState: function () {
            var $obj = this.$obj;
            var pageDirProperty = this.option.dir ? 'width' : 'height';
            var globalProperty = 'inner' + pageDirProperty[0].toUpperCase() + pageDirProperty.slice(1);

            $obj[pageDirProperty](root[globalProperty] * this.pageLength);
            this.pages[pageDirProperty](root[globalProperty]);

            this.movePagePosition(this.option.startPosition);
        },

        initEvent: function () {},

        movePagePosition: function (pageNumber) {
            var pageNumber = this.detectCurrentIndex(pageNumber || this.currentIndex);
        },

        move: function () {},

        detectCurrentIndex: function (pageNumber) {
            if (pageNumber < 0)
                return this.pageLength - 1;
            else if (pageNumber >= this.pageLength)
                return 0;

            return pageNumber;
        }

    });

    Page.fn.init.prototype = Page.fn;

    return Page;
});