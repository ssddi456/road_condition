import { DisplayStep, DisplayRoute } from "../../src/libs/grab_map_data";

export function updateChart(myChart, seriesData: seriesData[], keys: string[], options?) {
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
                console.log(params);

                return params[0].axisValue + '<br />'
                    + params.map(x => x.marker + ' ' + (x.data / 60).toFixed(2) + 'm').join('<br />');
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
};

export function createSeriesData(name: string, datas: { time: string, data: DisplayRoute[] }[], keys: string[]): seriesData {
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
