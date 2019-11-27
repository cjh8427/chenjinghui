/**
 * Created by liulin on 2017/1/16.
 *
 * 功能： 中文语言基类，
 * 描述： 在MapLibFor 后使用， 
 *
 */

// 画点画线翻译查询
L.drawLocal = {
    draw: {
        toolbar: {
            actions: {
                title: '取消画图',
                text: '取消'
            },
            undo: {
                title: '删除最后一个画图点',
                text: '删除最后一个点'
            },
            buttons: {
                polyline: '画线',
                polygon: '画多边形',
                rectangle: '画矩形',
                circle: '画圆',
                marker: '画点'
            }
        },
        handlers: {
            circle: {
                tooltip: {
                    start: '点击地图并拖拽画圆.'
                },
                radius: '半径'
            },
            marker: {
                tooltip: {
                    start: '点击地图画点.'
                }
            },
            polygon: {
                tooltip: {
                    start: '点击地图开始画多边形.',
                    cont: '点击地图继续画多边形.',
                    end: '点击第一点结束画多边形.'
                }
            },
            polyline: {
                error: '<strong>错误:</strong> 线段边缘不能交叉!',
                tooltip: {
                    start: '点击地图开始画线.',
                    cont: '点击地图继续画线.',
                    end: '点击最后一个点结束画线.'
                }
            },
            rectangle: {
                tooltip: {
                    start: '点击地图并拖拽画矩形.'
                }
            },
            simpleshape: {
                tooltip: {
                    end: '释放鼠标完成绘图.'
                }
            }
        }
    },
    edit: {
        toolbar: {
            actions: {
                save: {
                    title: '保存画图数据.',
                    text: '保存'
                },
                cancel: {
                    title: '取消编辑，还原编辑前的图形.',
                    text: '取消'
                }
            },
            buttons: {
                edit: '编辑图层.',
                editDisabled: '没有可编辑图层.',
                remove: '删除图层.',
                removeDisabled: '没有可删除图层.'
            }
        },
        handlers: {
            edit: {
                tooltip: {
                    text: '拖动鼠标，编辑图形.',
                    subtext: '单击“取消”以撤消更改.'
                }
            },
            remove: {
                tooltip: {
                    text: '点击删除一个图形'
                }
            }
        }
    }
};