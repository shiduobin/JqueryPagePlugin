(function ($, window) {
    $.fn.CustomPage = function (config) {
        // 默认配置
        var defaults = {
            pageSize: 10, // 每页数目
            count: 100, // 总页数
            current: 1, // 当前页是第几页
            prevDes: "上一页",
            nextDes: "下一页",
            homePageText: "首页",
            endPageText: "尾页",
            isShow: true, // 是否显示首尾页
            updateSelf: true,
            callback: null // 回调函数
        };
        // 插件配置合并
        this.oConfig = $.extend(defaults, config);
        var self = this;
        // 初始化函数
        var init = function () {
            // 初始化数据
            updateConfig(self.oConfig);
            // 事件绑定
            bindEvent();
        };
        // 更新方法
        var updateConfig = function (config) {
            typeof config.count !== 'undefined' ? self.count = config.count : self.count = self.oConfig.count;
            typeof config.pageSize !== 'undefined' ? self.pageSize = config.pageSize : self.pageSize = self.oConfig.pageSize;
            typeof config.current !== 'undefined' ? self.current = config.current : self.current = self.oConfig.current;
            // self.pageCount = Math.ceil(self.count / self.pageSize);
            self.pageCount = Math.ceil(self.count);
            format();
        };
        var format = function () {
            var current = self.current;
            var count = self.pageCount;
            var size = self.pageSize;
            var html = '<div class="page-container"><ul>';
            if (current != 1) {
                // 如果不是第一页添加上一页
                if (self.oConfig.isShow) {
                    html += '<li class="page-item page-prev page-action-text">' + self.oConfig.prevDes + '</li>' +
                        '<li class="page-item home page-action-text">' + self.oConfig.homePageText + '</li>';
                } else {
                    html += '<li class="page-item page-prev page-action-text">' + self.oConfig.prevDes + '</li>';
                }
            }
            var start, end;
            if (count > size) {
                if (current >= Math.floor(size / 2) + 2) {
                    if (current + (Math.ceil(size / 2) - 1) < count) {
                        start = current - Math.floor(size / 2);
                        end = current + (Math.ceil(size / 2) - 1);
                        for (var i = start; i <= end; i++) {
                            html += getItem(i);
                        }
                    } else {
                        start = count - (size - 1);
                        end = count;
                        for (var i = start; i <= end; i++) {
                            html += getItem(i);
                        }
                    }
                } else {
                    start = 1;
                    end = size;
                    for (var i = start; i <= end; i++) {
                        html += getItem(i);
                    }
                }
            }
            if (count < size) {
                start = 1;
                end = count;
                for (var i = start; i <= end; i++) {
                    html += getItem(i);
                }
            }

            if (current != count) {
                // 如果不是最后一页添加下一页
                if (self.oConfig.isShow) {
                    html += '<li class="page-item page-next page-action-text">' + self.oConfig.nextDes + '</li>' +
                        '<li class="page-item end page-action-text">' + self.oConfig.endPageText + '</li>';
                } else {
                    html += '<li class="page-item page-next page-action-text">' + self.oConfig.nextDes + '</li>';
                }
            }
            html += '</ul></div>';
            self.html(html);
        };
        var getItem = function (i) {
            var item = '';
            var current = (i == self.current);
            item += '<li class="page-item" data-page="' + i + '"><div class="page-icon-content">';
            if (current) {
                item += '<div class="page-icon-current page-icon-content"></div>';
                item += '</div><span class="page-text-current">' + i + '</span></li>';
            } else {
                item += '<div class="' + (i % 2 == 0 ? 'page-icon-type1' : 'page-icon-type2') + ' page-icon"></div>';
                item += '</div><span class="page-text">' + i + '</span></li>';
            }
            return item;
        };
        var bindEvent = function () {
            self.on('click', '.page-item', function () {
                var current;
                if ($(this).hasClass('page-prev')) {
                    current = Math.max(1, self.current - 1);
                } else if ($(this).hasClass('page-next')) {
                    current = Math.min(self.pageCount, self.current + 1);
                } else if ($(this).hasClass('home')) {
                    current = 1;
                } else if ($(this).hasClass('end')) {
                    current = self.pageCount;
                } else {
                    current = parseInt($(this).data('page'));
                }
                self.oConfig.callback && self.oConfig.callback(current);
                if (self.oConfig.updateSelf) {
                    self.current = current;
                    format();
                }
            })
        };
        // 启动
        init();
        //对外提供更新方法
        this.update = function (config) {
            updateConfig(config);
        };
        // 链式调用
        return self;
    };
})(jQuery, window);
