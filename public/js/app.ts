import { updateChart, createTimeSeriesData, createStatueSeriesData } from "./util";
import { serveStatic } from "serve-static";
import { trafficData } from "../../src/routes";

const timeGoHomeCostChart = echarts.init(document.getElementById('time-cost-go_home-chart') as HTMLDivElement);
const timeGoWorkCostChart = echarts.init(document.getElementById('time-cost-go_work-chart') as HTMLDivElement);


const _hour = 60 * 60 * 1000;
const _day = 24 * _hour;
const _5min = 5 * 60 * 1000;

const now = Math.floor(Date.now() / _5min) * _5min;
// const now = Math.floor(new Date(2018, 7 , 8, 15, 30).getTime() / _5min) * _5min;
function getDateStr(time: number) {
    const date = new Date(time);
    return date.getFullYear() + '-' +
        fix2(date.getMonth() + 1) + '-' +
        fix2(date.getDate()) + '_' +
        fix2(date.getHours()) + '-' +
        fix2(date.getMinutes())
}

function fix2(str) {
    str = '' + str;
    return str.length != 2 ? '0' + str : str;
}

function last<T>(arr: T[]): T {
    return arr[arr.length - 1];
}

const today = getDateStr(now);

const yestoday = getDateStr(now - 3 * _day);

const timeQuery = {
    from: yestoday,
    to: today
};


function updateLastTime(key: string, time: trafficData){
    const timeInSec = time.data[0].duration;
    const timeInMin = (timeInSec/ 60).toFixed(2);
    document.getElementById(key + '_time').innerText = timeInMin + ' min';
}

const timeRangeKeys = [];
for (let i = 0; i <= 3 * _day / _5min; i++) {
    timeRangeKeys.unshift(getDateStr(now - i * _5min));
}

$.getJSON('/',
    {
        type: 'go_home',
        ...timeQuery
    },
    function (data: trafficData[]) {
        updateLastTime('go_home', last(data));
        updateChart(timeGoHomeCostChart,
            [
                createTimeSeriesData('traffic', data, timeRangeKeys),
                createStatueSeriesData('traffic', data, timeRangeKeys),
            ],
            timeRangeKeys,
            {
                yAxis: [
                    {
                        type: 'value'
                    },
                    {
                        type: 'value'
                    }
                ]
            });
    });

$.getJSON('/',
    {
        type: 'go_work',
        ...timeQuery
    },
    function (data: trafficData[]) {
        updateLastTime('go_work', last(data));
        updateChart(timeGoWorkCostChart,
            [
                createTimeSeriesData('traffic', data, timeRangeKeys),
                createStatueSeriesData('traffic', data, timeRangeKeys),
            ],
            timeRangeKeys,
            {
                yAxis: [
                    {
                        type: 'value'
                    },
                    {
                        type: 'value'
                    }
                ]
            });
    });
