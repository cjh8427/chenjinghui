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
            // initInDataGrid('dtGridContainer', 'dtGridToolBarContainer');
            var _tableW = $('.ex-layout-content').width();
            var _tableH = $('.ex-layout-content').height() - $('.ex-layout-form-search').height() - 79;

            $('#dtGridContainer').jqGrid({
                url: 'http://trirand.com/blog/phpjqgrid/examples/jsonp/getjsonp.php?callback=?&qwery=longorders',
                mtype: "GET",
                editurl: 'clientArray',
                datatype: "jsonp",
                colModel: [
                    { label: 'ID', name: 'OrderID', key: true, editable: false, width: 20, align: 'center' },
                    { label: '车牌号', name: 'CustomerID', editable: true },
                    { label: '日期', name: 'OrderDate', editable: true, align: 'center' },
                    { label: '载重', name: 'Freight', editable: true },
                    { label: '驾驶员', name: 'ShipName', editable: true },
                    { label: '车牌号', name: 'CustomerID', editable: true },
                    { label: '日期', name: 'OrderDate', editable: true, align: 'center' },
                    { label: '载重', name: 'Freight', editable: true },
                    { label: '驾驶员', name: 'ShipName', editable: true },
                    {
                        label: "操作",
                        name: "actions",
                        formatter: "actions",
                        formatoptions: {
                            keys: true,
                            editOptions: {},
                            addOptions: {},
                            delOptions: {}
                        }, align: 'center', width: 130
                    }
                ],
                multiselect: true,
                viewrecords: true,
                recordtext: '查询出 {2} 条记录， ',
                width: _tableW,
                height: _tableH,
                loadonce: true,
                rowNum: 10,
                rowList: [10, 15, 20, 30, 50],
                pager: '#dtGridToolBarContainer',
                subGrid: true, // set the subGrid property to true to show expand buttons for each row
                subGridRowExpanded: showChildGrid, // javascript function that will take care of showing the child grid
                subGridOptions: {
                    // load the subgrid data only once
                    // and the just show/hide
                    reloadOnExpand: false,
                    // select the row when the expand column is clicked
                    selectOnExpand: true
                },
            });


            // the ID of the grid tow  and the primary key of the row
            function showChildGrid(parentRowID, parentRowKey) {
                var childGridID = parentRowID + "_table";
                var childGridPagerID = parentRowID + "_pager";

                //childGridURL = childGridURL + "&parentRowID=" + encodeURIComponent(parentRowKey)

                // add a table and pager HTML elements to the parent grid row - we will render the child grid here
                $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

                $("#" + childGridID).jqGrid({
                    url: 'http://trirand.com/blog/phpjqgrid/examples/jsonp/getjsonp.php?callback=?&qwery=longorders',
                    mtype: "GET",
                    datatype: "json",
                    page: 1,
                    colModel: [
                        { label: 'ID', name: 'OrderID', key: true, width: 20, align: 'center' },
                        { label: '违章日期', name: 'OrderDate', align: 'center' },
                        { label: '车牌号', name: 'ShipName', editable: true },
                        { label: '公司', name: 'ShipCity', editable: true },
                        { label: '载重', name: 'Freight', width: 80, align: 'center', editable: true },
                        {
                            label: "操作",
                            name: "actions",
                            formatter: "actions",
                            formatoptions: {
                                keys: true,
                                editOptions: {},
                                addOptions: {},
                                delOptions: {}
                            }, align: 'center'
                        }
                    ],
                    multiselect: true,
                    //loadonce: true,
                    width: $("#" + childGridID).width(),
                    viewrecords: true,
                    recordtext: '查询出 {2} 条记录， ',
                    height: '100%',
                    rowNum: 20,
                    rowList: [20, 30, 50],
                    pager: "#" + childGridPagerID,
                    subGrid: true, // set the subGrid property to true to show expand buttons for each row
                    subGridRowExpanded: showChildGrid, // javascript function that will take care of showing the child grid
                    subGridOptions: {
                        // load the subgrid data only once
                        // and the just show/hide
                        reloadOnExpand: false,
                        // select the row when the expand column is clicked
                        selectOnExpand: true
                    },
                });

            }



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