export default function getData() {
    const tyPointer = [
        {
        name: '化客头街道',
        value: [112.4006027729, 37.8871843817, randomize(), randomColor()],
        areid: 77,
        areCode: '420104',
    },
        {
            name: '东社街道',
            value: [112.4861831875, 37.8848564531, randomize(), randomColor()],
            areid: 72,
            areCode: '420103',
        },
        {
            name: '万柏林街道',
            value: [112.5188383117, 37.8922400740, randomize(), randomColor()],
            areid: 65,
            areCode: '420102',
        },
        {
            name: '兴华街道',
            value: [112.5224980621, 37.8833636318, randomize(), randomColor()],
            areid: 27,
            areCode: '420112',
        },
        {
            name: '和平街道',
            value: [112.5031909786, 37.8672629486, randomize(), randomColor()],
            areid: 59,
            areCode: '420116',
        },
        {
            name: '西铭街道',
            value: [112.4455238669, 37.8692819268, randomize(), randomColor()],
            areid: 88,
            areCode: '420106',
        },
        {
            name: '杜儿坪街道',
            value: [112.4178609465, 37.8438249187, randomize(), randomColor()],
            areid: 44,
            areCode: '420111',
        },
        {
            name: '白家庄街道',
            value: [112.4471093376, 37.8439165623, randomize(), randomColor()],
            areid: 86,
            areCode: '420107',
        },
        {
            name: '神堂沟街道',
            value: [112.4965664362, 37.8182208460, randomize(), randomColor()],
            areid: 53,
            areCode: '420115',
        },
        {
            name: '南寒街道',
            value: [112.4827575825, 37.8709317081, randomize(), randomColor()],
            areid: 53,
            areCode: '420115',
        },
        {
            name: '小井峪街道',
            value: [112.5133159598, 37.8645362747, randomize(), randomColor()],
            areid: 53,
            areCode: '420115',
        },
        {
            name: '万柏林区区政府',
            value: [112.5219623021, 37.8655832561, randomize(), randomColor()],
            areid: 53,
            areCode: '420115',
        },
        {
            name: '下元街道',
            value: [112.5183257578, 37.8576895320, randomize(), randomColor()],
            areid: 53,
            areCode: '420115',
        },
        {
            name: '长风西街道',
            value: [112.5223890396, 37.8290483842, randomize(), randomColor()],
            areid: 53,
            areCode: '420115',
        },
        {
            name: '万柏林区教学城管指挥中心',
            value: [112.5346768895, 37.8265056093, randomize(), randomColor()],
            areid: 53,
            areCode: '420115',
        },
    ];

    const symbolList = [
        {
            name: '垃圾桶站',
            value: [112.3754131133, 37.8813989386]
        },
        {
            name: '垃圾桶站',
            value: [112.5050560275, 37.8663211892]
        },
        {
            name: '垃圾桶站',
            value: [112.5072876254, 37.8610015376]
        },
        {
            name: '垃圾桶站',
            value: [112.4936676273, 37.8534206148]
        },
    ]

    return {
        legend: {
            orient: 'vertical', // horizontal水平  vertical垂直
            top: 'bottom',
            left: 'right',
            data: ['垃圾中转站', '垃圾桶站', '填埋场', '其他'],
            selected: {
                垃圾中转站: true,
                垃圾桶站: true,
                填埋场: true,
                其他: true,
            },
            textStyle: {
                color: '#80a4fb',
                fontSize: 16,
            },
            itemGap: 15,
            padding: 15,
            zlevel: 15,
        },
        tooltip: {
            show: true,
        },
        geo: {
            map: 'ty',
            // left: 200,
            // right: 10,
            // layoutCenter: ['55%', '50%'],
            // layoutSize:650,
            zoom: 1.25,
            itemStyle: {
                color: '#193178',
                opacity: 1,
                borderWidth: 2,
                borderColor: '#476cc8',
            },
            label: {
                show: true,
                textStyle: {
                    color: '#00ff98', // 地图初始化区域字体颜色
                    fontSize: 14,
                    backgroundColor: 'transparent',
                },
            },
            regions: [{
                name: '万柏林区',
                selected: true,
            }, {
                name: '娄烦县',
                selected: true,
            }, {
                name: '迎泽区',
                selected: true,
            }, {
                name: '清徐县',
                selected: true,
            }],
            emphasis: { // 当鼠标放上去  地区区域是否显示名称
                itemStyle: {
                    color: '#274cba',
                },
                label: {
                    show: true,
                    textStyle: {
                        color: '#00ff98', // 地图初始化区域字体颜色
                        fontSize: 14,
                        backgroundColor: 'transparent',
                    },
                },
            },
        },

        series: [{
            type: 'scatter',
            coordinateSystem: 'geo',
            data: symbolList.sort((a, b) => b.value - a.value),
            symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAmCAYAAAClI5npAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRDQkNGRURFOTMzQzExRTlCN0I1QTI2NjA1NDEwM0FGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRDQkNGRURGOTMzQzExRTlCN0I1QTI2NjA1NDEwM0FGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NENCQ0ZFREM5MzNDMTFFOUI3QjVBMjY2MDU0MTAzQUYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NENCQ0ZFREQ5MzNDMTFFOUI3QjVBMjY2MDU0MTAzQUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6zlImNAAAMBklEQVR42oxY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',
            symbolSize(val) {
                return 20;
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke',
            },
            hoverAnimation: false,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                },
                emphasis: {
                    formatter: '{b}',
                    position: 'right',
                    show: false,
                },
            },
            itemStyle: {
                normal: {
                    color(val) {
                        return val.data.value[3];
                    },
                    shadowBlur: 10,
                },
            },
            zlevel: 1,
        }, {
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: tyPointer.sort((a, b) => b.value - a.value),
            symbolSize(val) {
                return val[2] * 3;
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke',
            },
            hoverAnimation: false,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                },
                emphasis: {
                    formatter: '{b}',
                    position: 'right',
                    show: false,
                },
            },
            itemStyle: {
                normal: {
                    color(val) {
                        return val.data.value[3];
                    },
                    shadowBlur: 10,
                },
            },
            zlevel: 1,
        }, {
            type: 'scatter',
            coordinateSystem: 'geo',
            data: tyPointer.sort((a, b) => b.value - a.value),
            symbolSize(val) {
                return val[2] * 3;
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke',
            },
            hoverAnimation: false,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                },
                emphasis: {
                    formatter: '{b}',
                    position: 'right',
                    show: false,
                },
            },
            itemStyle: {
                normal: {
                    color(val) {
                        return val.data.value[3];
                    },
                    shadowBlur: 10,
                },
            },
            zlevel: 1,
        }],
    };
}


function randomize() {
    return 5;
}

function randomColor() {
    const color = ['#1ebce5', '#e16880', '#42eaa6', '#f4cb7a'];
    const index = Math.round(Math.random() * 3);
    return color[index];
}
