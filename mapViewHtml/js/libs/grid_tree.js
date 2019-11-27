!function () {
    var main = {
        init: function () {
            var a = this;
            a.initResize(), a.initIndex(), a.initGrid();
        },

        initIndex: function () {
            resizeBody();
            treeList(null, true);
        },
        //窗口分辨率调整
        initResize: function () {
            var a = null;
            $(window).resize(function () {
                a && clearTimeout(a), a = setTimeout(resizeBody(), 100)
            })
        },
        initGrid: function () {
            initGrid('dtGridContainer', 'dtGridToolBarContainer');
        }


    }

    main.init()
}(jQuery);


//加载echarts 
function showCharts() {
    var _w = $('.ex-layout-content').width();
    var _h = $('.ex-layout-content').height() - $('.ex-layout-form-search').height();
    var $echartContent = $('.ex-layout-charts-content-box');

    $echartContent.css({ "width": _w, "height": _h }).parent('div.ex-layout-charts-content').addClass('in');

    var simpleChart = echarts.init(document.getElementById('simpleChart'));
    var option = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['出土量', '消纳量']
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '出土量',
                type: 'bar',
                data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                }
            },
            {
                name: '消纳量',
                type: 'bar',
                data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                markPoint: {
                    data: [
                        { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183 },
                        { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                }
            }
        ]
    };


    loadAnimate($echartContent, null);

    setTimeout(function () {
        simpleChart.setOption(option, true);
        loadAnimate(null, 'remove');
    }, 1500);
}