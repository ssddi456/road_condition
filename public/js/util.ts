import { DisplayStep, DisplayRoute } from "../../src/libs/grab_map_data";
import { ECharts, EChartOption } from "echarts";

export function updateChart(myChart: ECharts, seriesData: Partial<seriesData>[], keys: string[], options?: Partial<EChartOption>) {
    for (let i = 0; i < seriesData.length; i++) {
        const element = seriesData[i];
        if (!element) {
            return;
        }
    }

    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {

                return params[0].axisValue + '<br />'
                    + params[0].data + ' min <br />'
                    + params[1].data.distance + 'm';
            },
        },
        xAxis: {
            type: 'category',
            data: keys
        },
        yAxis: {
            type: 'value'
        },
        series: seriesData,
        legend: {
            data: seriesData.map(x => x && x.name)
        },
        ...options
    };

    myChart.setOption(option, true);
    myChart.resize();
}

type seriesData = {
    data: any[],
    markLine: { data: any[] },
    type: string,
    name: string,
    xAxisIndex: number,
    yAxisIndex: number,
    renderItem(params: any, api: any): Object,
};

export function createTimeSeriesData(name: string, datas: { time: string, data: DisplayRoute[] }[], keys: string[]): Partial<seriesData> {
    if (!datas) {
        return;
    }

    const markLines = [];
    const mappedData = [];
    for (let index = 0; index < datas.length; index++) {
        const element = datas[index];
        const time = element.time;
        const idx = keys.indexOf(time);
        if (idx != -1) {
            mappedData[idx] = element.data[0].duration;
        }
    }

    for (let index = 0; index < keys.length; index++) {
        mappedData[index] = mappedData[index] || 0;
    }

    return {
        data: mappedData,

        markLine: {
            data: markLines
        },

        type: 'line',
        name,
    }
}
function getRenderStatusItem(datas: DisplayRoute[]) {
    return function (params, api) {
        const yValue = api.value(1);

        const actualData = datas[params.dataIndexInside].steps;
        const start = api.coord([api.value(0), yValue]);
        const size = api.size([api.value(1) - api.value(0), yValue]);
        const style = api.style();
        const styles = [
            '#ffffff',
            '#00ff45',
            '#ffc107',
            '#dc3545',
            '#9c0816'
        ].map(x => { return { ...style, fill: x } });

        const wholeBox = {
            x: start[0],
            y: start[1],
            width: size[0],
            height: size[1]
        };

        type box = {
            x: number, y: number, width: number, height: number
        };
        type rect = {
            type: 'rect',
            style: any,
            shape: box,
        };
        const rects = [] as rect[];
        const boxes = [];
        let lastDistance = 0;

        for (let index = 1; index < actualData.length; index++) {
            const element = actualData[index];
            const currnetBox: box = {
                x: start[0],
                y: wholeBox.y + wholeBox.height * (lastDistance / yValue),
                width: size[0],
                height: wholeBox.height * (element.distance / yValue)
            };

            lastDistance += element.distance;
            rects.push({
                type: 'rect',
                style: styles[element.status],
                shape: currnetBox
            });
            boxes.push(currnetBox);
        }

        return {
            type: 'group',
            children: rects
        };
    }
}
export function createStatueSeriesData(name: string, datas: { time: string, data: DisplayRoute[] }[], keys: string[]): Partial<seriesData> {
    if (!datas) {
        return;
    }

    const markLines = [];
    const mappedData = [] as Array<DisplayRoute & { value: number }>;
    for (let index = 0; index < datas.length; index++) {
        const element = datas[index];
        const time = element.time;
        const idx = keys.indexOf(time);
        if (idx != -1) {
            mappedData[idx] = element.data[0] as DisplayRoute & { value: number };
            mappedData[idx].value = mappedData[idx].distance;
        }
    }

    for (let index = 0; index < keys.length; index++) {
        mappedData[index] = mappedData[index] || {
            distance: 0,
            duration: 0,
            taxi_fee: 0,
            value: 0,
            steps: []
        };
    }

    return {
        data: mappedData,
        yAxisIndex: 1,

        markLine: {
            data: markLines
        },

        type: 'custom',
        renderItem: getRenderStatusItem(mappedData),
        name,
    }
}
