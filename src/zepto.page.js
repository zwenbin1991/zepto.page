/*
 zepto.page.js基于zepto.js的一个页面滑动插件
 轻量、源码易读、Api松耦合
 QQ：461153861
 Copyright 2014 zengwenbin. All Rights Reserved
 MIT
*/

(function ($, root, factory) {
    $.fn.Page = function (option) {
        factory($, root)(this, option);
    };
})($ || Zepto, window, function ($, root) {
    'use strict';

    // 默认插件配置
    var defaultOption = {
        pageSelector: '.page',                                          // 页选择器
        duration: 500,                                                  // 滑动时间 -- 毫秒单位
        dir: 0,                                                         // 滑动方向 -- 0：垂直方向 1：水平方向
        drag: false,                                                    // 页是否可拖拽
        deltaTimes: 0.1,                                                // 滑动距离大于1个值的时候，开启滑动，滑动距离 = delta(滑动倍数) * 页面高度|页面宽度
        //startPosition: 0,                                               // 起始位置停在第几页
        pageWillHandle: function (data) {},                             // 页滑动前处理函数
        pagingHandle: function (data) {},                               // 页滑动时处理函数
        pageDidHandle: function (data) {}                               // 页滑动结束处理函数
    };

    function Page ($obj, option) {
        return new Page.fn.init($obj, option);
    }

    $.extend(Page.fn = Page.prototype, {
        init: function ($obj, option) {
            this.$obj = $obj;                                           // 绑定当前zepto对象
            this.option = $.extend({}, defaultOption, option);          // 配置对象
            this.pages = $obj.find(this.option.pageSelector);           // 页集合
            this.pageLength = this.pages.length;                        // 页个数
            this.currentIndex = 0;                                     // 当前索引
            this.isMoving = false;                                      // 是否正在滑动

            this.setState();
            this.initEvent();
        },

        setState: function () {
            var $obj = this.$obj;
            var sizeProperty = this.option.dir ? 'width' : 'height';
            $obj[sizeProperty](this.getMoveDelta() * this.pageLength);
            $obj[sizeProperty]

            this.pages[sizeProperty](this.getMoveDelta());
            this.move(this.currentIndex * this.getMoveDelta());
            //this.movePagePosition(this.option.startPosition);
        },

        initEvent: function () {
            var $obj = this.$obj;
            var events = ['touchstart', 'touchend', 'touchmove'];

            // 绑定touch事件
            events.forEach(function (event) {
                var listener = '_' + event + 'Listener';
                $obj.on(event, this[listener].bind(this));
            }, this);
        },

        _touchstartListener: function (e) {
            if (this.isMoving)
                return;

            var touch = e.targetTouches[0];

            this.startX = touch.pageX;
            this.startY = touch.pageY;
        },

        _touchendListener: function (e) {
            if (this.isMoving)
                return;

            var touch = e.changedTouches[0];
            var delta = this.getMoveDelta();
            var currentDeltaTimes;

            if (!this.option.dir)
                currentDeltaTimes = (touch.pageY - this.startY) / delta;
            else
                currentDeltaTimes = (touch.pageX - this.startX) / delta;

            // 是否达到触发滑动临界点
            var isMoveRegion = Math.abs(currentDeltaTimes) > this.option.deltaTimes;
            // 得到方向
            var subDirection = isMoveRegion ? currentDeltaTimes > 0 ? -1 : 1 : 0;

            this.movePagePosition(this.currentIndex + subDirection);
        },

        _touchmoveListener: function (e) {
            var touch = e.changedTouches[0];

            if (this.option.drag) {
                if (this.isMoving) {
                    this.startX = touch.pageX;
                    this.startY = touch.pageY;

                    return;
                }

                var deltaX = touch.pageX - this.startX;
                var deltaY = touch.pageY - this.startY;
                var delta;

                if (this.currentIndex === 0 && deltaY > 0 || this.currentIndex === this.pageLength - 1 && deltaY < 0)
                    deltaY /= 2;
                else if (this.currentIndex === 0 && deltaX > 0 || this.currentIndex === this.pageLength - 1 && deltaY < 0)
                    deltaX /= 2;

                delta = -this.currentIndex * this.getMoveDelta() + (!this.option.dir ? deltaY : deltaX);
                this.move(delta);
            }

            e.preventDefault();
        },

        movePagePosition: function (pageNumber) {
            // 检测下一页或上一页是否存在
            var pageNumber = this.detectPageNumber(pageNumber);
            var currentIndex = this.currentIndex;

            // 如果存在，调用滑动前的处理函数，传入当前页的位置和下一页的位置
            if (pageNumber !== currentIndex) {
                this.option.pageWillHandle({
                    currentPageNumber: currentIndex,
                    nextPageNumber: pageNumber
                });
            }

            this.isMoving = true;
            this.currentIndex = pageNumber;

            // 调用滑动中的处理函数，传入上一页和下一页
            if (pageNumber !== currentIndex) {
                this.option.pagingHandle({
                    prevPageNumber: currentIndex,
                    currentPageNumber: pageNumber
                });
            }

            // 滑动
            this.move(-pageNumber * this.getMoveDelta());

            // 滑动结束
            setTimeout((function () {
                this.isMoving = false;

                if (pageNumber !== currentIndex) {
                    this.option.pageDidHandle({
                        prevPageNumber: currentIndex,
                        currentPageNumber: pageNumber
                    });
                }
            }).bind(this), this.option.duration);
        },

        move: function (delta) {
            var deltaX, deltaY;

            // 垂直方向滑动
            if (!this.option.dir)
                deltaX = 0, deltaY = delta;

            // 水平方向滑动
            else
                deltaX = delta, deltaY = 0;

            this.$obj.css({
                'transform': 'translate3d('+ deltaX +'px, '+ deltaY +'px, 0px)',
                '-webkit-transform': 'translate3d('+ deltaX +'px, '+ deltaY +'px, 0px)'
            });
        },

        getMoveDelta: function () {
            var sizeProperty = !this.option.dir ? 'height' : 'width';
            return window['inner' + sizeProperty[0].toUpperCase() + sizeProperty.slice(1)];
        },

        detectPageNumber: function (pageNumber) {
            if (pageNumber < 0)
                return 0;
            else if (pageNumber >= this.pageLength)
                return this.pageLength - 1;

            return pageNumber;
        }
    });

    Page.fn.init.prototype = Page.fn;

    return Page;
});