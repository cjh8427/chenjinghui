/*main js ximoo 2016-05-09*/

!function () {
    var a = {
        init: function () {
            //var a = this;
            //a.initIndex();
            //a.initEvent();
        },
        initIndex: function () {
            setTimeout(function () {
                //弹出警告例子
                var _n = Math.round(Math.random() * 2);
                //alert(_n);
                var _msg = '';
                (_n == 1) ? _msg = '发送失败' : _msg = '发送成功';
                alertPop(_msg, _n);
            }, 5000);
        },
        initEvent: function () {
            setTimeout(function () {
                navAction();
            }, 50);
        }
    };
    a.init();
}(jQuery);

var _arry = [], _Tnumber;
var _tabWid = $(".ex-layout-page-tab").width(), _tabLastWid, _tabBoxWid;

function navAction() {
    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };
    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };


    //导航
    $('.ex-layout-header-bottom ul').hide().eq(0).show();
    $('.ex-layout-nav > li').bind('click', function () {
        var _i = $(this).index();
        $('.ex-layout-header-bottom ul').hide().eq(_i).show();
        if (_i == 0) {
            $(".ex-layout-content iframe").hide();
            $(".ex-layout-page-tab li").removeClass("ec-active");
            $("#MainFrame0_content").show();
            $(".ex-layout-page-tab li:first-child").addClass("ec-active");
        }
    })

    $('.ex-layout-nav > li').bind('click', function () {
        var _i = $(this).index();
        $('.ex-layout-header-bottom ul').hide().eq(_i).show().find("li:first a").click();
        if (_i == 0) {
            $(".ex-layout-content iframe").hide();
            $(".ex-layout-page-tab li").removeClass("ec-active");
            $("#MainFrame0_content").show();
            $(".ex-layout-page-tab li:first-child").addClass("ec-active");
        }
    });

    $('.ex-layout-header-bottom ul > li').bind('click', function () {
        var _i = $(this).index();
        $('.ex-layout-header-bottom ul > li').removeClass('ec-active').eq(_i).addClass('ec-active');
    })
    $('.ex-layout-header-bottom ul > li > a').bind('click', function () {
        var _i = $(this).index();
        var _url = $(this).attr('data-url');
        var _name = $(this).text();
        addTab(_url, _name);
        showTab(_name)
        $('.ex-btn-page-tab-remove').show();

    })

    $(".ex-layout-nav > li:first").click();

    function showTab(name) {
        $('.ex-layout-page-tab li > a').each(function () {
            var _tabName = $(this).text();
            if (_tabName === name) {
                var contentname = $(this).attr("id") + "_content";
                $(".ex-layout-content iframe").hide();
                $(".ex-layout-page-tab li").removeClass("ec-active");
                $("#" + contentname).show();
                $(this).parent('li').addClass("ec-active");
                return;
            }
        })
    }



    function addTab(link, name) {
        if (link.length == 0)
            return;
        _Tnumber = _arry.length + 1;
        var _tabHtml = '<li class="ec-active"><a class="tab" id="MainFrame' + _Tnumber + '" href="javascript:void(0);">' + name + '</a><em id="MainFrame' + _Tnumber + '" class="remove">x</em></li>'
        var _contentHtml = '<iframe src="' + link + '" class="ex-layout-mainframe" name="MainFrame' + _Tnumber + '_content" id="MainFrame' + _Tnumber + '_content" allowfullscreen mozallowfullscreen webkitallowfullscreen frameborder="0"></iframe>'

        setTimeout(function () {
            if ($.inArray(name, _arry) < 0) {
                $(".ex-layout-page-tab li").removeClass("ec-active");
                $(".ex-layout-content iframe").hide();
                $(".ex-layout-page-tab").append(_tabHtml);
                $(".ex-layout-content").append(_contentHtml);
                $("#MainFrame" + _Tnumber + "_content").show();
                _arry.push(name);
                _tabBoxWid = $(".ex-layout-page-tab-box").width();
                _tabWid = 10;
                $(".ex-layout-page-tab li").each(function () {
                    _tabWid = _tabWid + $(this).width() + 2;
                    $(".ex-layout-page-tab").width(_tabWid);
                    if (_tabWid > _tabBoxWid) {
                        $('.ex-layout-page-tab-control').show();
                        $(".ex-layout-page-tab").css({ "left": _tabBoxWid - _tabWid })
                    } else {
                        $('.ex-layout-page-tab-control').hide();
                        $(".ex-layout-page-tab").css({ "left": "0px", "right": "auto" });
                    }
                });
                _tabLastWid = $(".ex-layout-page-tab li:last-child").width() + 2;
                //console.log(_tabBoxWid + '/' + _tabWid);
            }
            //标签点击事件
            $('.ex-layout-page-tab li a.tab').unbind('click').bind('click', function () {
                var contentname = $(this).attr("id") + "_content";
                $(".ex-layout-content iframe").hide();
                $(".ex-layout-page-tab li").removeClass("ec-active");
                $("#" + contentname).show();
                $(this).parent('li').addClass("ec-active");
            });
            //删除标签事件
            $('.ex-layout-page-tab li em.remove').unbind('click').bind('click', function () {
                var _menuName = $(this).prev('a').text();
                var contentname = $(this).attr("id") + "_content";
                $("#" + contentname).remove();
                $(this).parent('li').remove();
                console.log(contentname)
                setTimeout(function () {
                    if ($(".ex-layout-page-tab li.ec-active").size() == 0 && $(".ex-layout-page-tab li").size() > 0) {
                        var firsttab = $(".ex-layout-page-tab li:first-child");
                        firsttab.addClass("ec-active");
                        var firsttabid = $(firsttab).find("a.tab").attr("id");
                        $("#" + firsttabid + "_content").show();
                    } else if ($(".ex-layout-page-tab li").size() <= 0) {
                        $("#MainFrame0_content").show();
                    }
                    _arry.remove(_menuName);
                    _Tnumber = _arry.length;
                    if (_Tnumber === 0) {
                        $('.ex-btn-page-tab-remove').hide();
                    }
                    _tabWid = 1;
                    $(".ex-layout-page-tab li").each(function () {
                        _tabWid = _tabWid + $(this).width() + 2;
                        $(".ex-layout-page-tab").width(_tabWid);
                        if (_tabWid > _tabBoxWid) {
                            $('.ex-layout-page-tab-control').show();
                            $(".ex-layout-page-tab").css({ "left": _tabBoxWid - _tabWid })
                        } else {
                            $('.ex-layout-page-tab-control').hide();
                            $(".ex-layout-page-tab").css({ "left": "0px", "right": "auto" });
                        }
                    });
                }, 50)
            });
            //清除按钮事件
            $('.ex-btn-page-tab-remove').unbind('click').bind('click', function () {
                setTimeout(function () {
                    //没做数据概览
                    $('.ex-layout-content iframe').remove();
                    $(".ex-layout-page-tab li").remove();

                    //做了数据概览
                    //$('.ex-layout-content iframe:not(:first-child)').remove();
                    //$(".ex-layout-page-tab li:not(:first-child)").remove();
                    //$(".ex-layout-page-tab li:first-child").addClass('ec-active');
                    //$(".ex-layout-page-tab").width($(".ex-layout-page-tab li:first-child").width() + 2);
                    //$("#MainFrame0_content").show();

                    $('.ex-btn-page-tab-remove').hide();
                    $('.ex-layout-page-tab-control').hide();
                    $(".ex-layout-page-tab").css({ "left": "0px", "right": "auto" });
                    _arry.length = 0;
                    _tabWid = 1;
                    $(".ex-layout-page-tab li").each(function () {
                        _tabWid = _tabWid + $(this).width() + 2;
                        $(".ex-layout-page-tab").width(_tabWid);
                    });
                }, 50)
            });
            //左右滑动事件
            $('.ex-tab-control-left').unbind('click').bind('click', function () {
                setTimeout(function () {
                    $(".ex-layout-page-tab").stop().animate({ 'left': '0px' }, 800).css('right', 'auto');
                }, 50)
            })
            $('.ex-tab-control-right').unbind('click').bind('click', function () {
                setTimeout(function () {
                    $(".ex-layout-page-tab").stop().animate({ 'right': '0px' }, 800).css('left', 'auto');
                }, 50)
            })
        }, 250);
    }
}

//格式化时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}

//加载动画
var loadAnimate = function (e, type) {
    var _loadHtml = '<div class="ex-layout-loading"><i>Loading...</i></div>'
    var $this = e;
    var $loading = $('.ex-layout-loading');
    //$this.append(_loadHtml);
    (type == 'remove') ? $loading.remove() : $this.append(_loadHtml);
}

//增删改弹出模拟窗口
var addModal = function (title, msg, type) {
    var d = dialog({
        title: title,
        content: msg,
        okValue: (type == 'save') ? '保存' : '确定',
        ok: function () {
            this.title('提交中…');
            return false;
        },
        cancelValue: '取消',
        cancel: function () { }
    });
    d.showModal();
}

//增删改弹出模拟窗口
var sendModal = function (title, msg, type) {
    var d = dialog({
        title: title,
        content: msg,
        okValue: (type == 'save') ? '发送' : '确定',
        ok: function () {
            this.title('提交中…');
            return false;
        },
        cancelValue: '取消',
        cancel: function () { }
    });
    d.showModal();
}

//查看弹出模拟窗口
var popModal = function (title, msg, type) {
    var d = dialog({
        fixed: true,
        align: "right bottom",
        title: title,
        content: msg
    });
    d.showModal();
}

//选择车辆
var selectCarModal = function (title, msg, type) {
    var d = dialog({
        title: title,
        content: msg,
        okValue: (type == 'save') ? '保存' : '确定',
        ok: function () {
            this.title('提交中…');
            return false;
        },
        cancelValue: '取消',
        cancel: function () { }
    });
    d.showModal();
}

//绑定车辆
var bandCarModal = function (title, msg, type) {
    var d = dialog({
        title: title,
        content: msg,
        okValue: (type == 'save') ? '保存' : '确定',
        ok: function () {
            this.title('提交中…');
            return false;
        },
        cancelValue: '取消',
        cancel: function () { }
    });
    d.showModal();
}

//提示警告框
var alertPop = function (msg, color) {
    var _c
    (color == 1) ? (_c = 'ec-alert-danger') : (_c = 'ec-alert-success');
    var _alertHtml = '<div class="ec-alert ' + _c + ' slidedown in">';
    _alertHtml += '<button type="button" class="ec-close">&times;</button>';
    _alertHtml += msg;
    _alertHtml += '</div>';

    $('body').append(_alertHtml);
    $('.ec-alert').alert()
    setTimeout(function () {
        $('.ec-alert').alert('close');
    }, 3000);
}

var initResize = function () {
    $(window).resize(function () {
        $('.ex-layout-content').css("width", $(window).width() - $('.ex-layout-sider').width() + "px");
        $('.ex-layout-content').css({ height: $(window).height() });
        $("#dtGridContainer").setGridWidth($('.ex-layout-content').width());
        $("#dtGridContainer").setGridHeight($('.ex-layout-content').height() - $('.ex-layout-form-search').height() - 79);
    });
}

//调整LoadBox分辨率 
function resizeBody(type) {
    var _tWid, _tHei, _sHei;

    switch (type) {
        case 1:
            //统计示例二、三等无tree侧边栏的GRID
            _tWid = 0;
            _tHei = 0;
            _sHei = 40
            $('.ex-layout-content').css({ height: $(window).height() - _tHei, width: $(window).width() - _tWid });
            var $dtGridCantrain = $('.dt-grid-container');
            var $formSearch = $('.ex-layout-form-search');
            $dtGridCantrain.height($('.ex-layout-content').height() - $formSearch.height() - _sHei);

            break;
        case 2:
            //概览分辨率
            _tWid = 220;
            _tHei = 0;
            _sHei = 0
            $('.ex-layout-main').css({ height: $(document.body).outerHeight(true), width: $(document.body).outerWidth(true) });
            $('.ex-layout-content').css({ height: $(document.body).outerHeight(true), width: $(document.body).outerWidth(true) - _tWid - 20 });
            $('.ex-layout-sider').css({ height: $('.ex-layout-content').prop("scrollHeight"), width: _tWid });
            //$('.ex-layout-overview-tree-box').height($('.ex-layout-sider').height() / 5);
            $('.ex-layout-overview-charts-base').height($('.ex-layout-sider').height() * 4.8 / 5);



            break;
        case 3:
            //视频回放
            _tWid = 239;
            _tHei = 33;
            _sHei = 40;
            $('.ex-layout-sider').width(_tWid);
            $('.ex-layout-sider >.ex-layout-struckbox-search').width(_tWid - 18);
            $('.ex-layout-sider > .ex-layout-struckbox-content').height($(window).height() / 3 - _tHei);

            $('.ex-layout-content').css({ height: $(window).height() - _tHei, width: $(window).width() - _tWid });
            var $dtGridCantrain = $('.dt-grid-container');
            var $formSearch = $('.ex-layout-form-search');
            $dtGridCantrain.height($('.ex-layout-content').height() / 2 - 47);

            break;
        default:
            //常规有tree侧边栏的GRID
            _tWid = 219;
            _tHei = 60;
            _sHei = 40
            $('.ex-layout-sider').width(_tWid);
            $('.ex-layout-sider > .ex-layout-struckbox-content').height($(window).height() - _tHei - 13 - $(".ec-tabs.ex-video-cloud-panel.ec-no-layout").height() - $(".ex-layout-video-datapicker").height() - $('.ex-layout-video-datapicker').prev('.ex-theme-sider-title').height());
            $('.ex-layout-content').css({ height: $(window).height(), width: $(window).width() - _tWid });
            var $dtGridCantrain = $('.dt-grid-container');
            var $formSearch = $('.ex-layout-form-search');
            $dtGridCantrain.height($('.ex-layout-content').height() - $formSearch.height() - _sHei);

            break;
    }
}



