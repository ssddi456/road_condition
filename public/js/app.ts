import { updateChart, createSeriesData } from "./util";
import { serveStatic } from "serve-static";
import { trafficData } from "../../src/routes";

const timeGoHomeCostChart = echarts.init(document.getElementById('time-cost-go_home-chart') as HTMLDivElement);
const timeGoWorkCostChart = echarts.init(document.getElementById('time-cost-go_work-chart') as HTMLDivElement);


$.getJSON('/?type=go_home', function (data: trafficData[] ) {
    const timeKeys = data.map(x => x.time);
    updateChart(timeGoHomeCostChart, 
        [createSeriesData('traffic', data.map(x => x.data), timeKeys)],
        timeKeys);
});

$.getJSON('/?type=go_work', function (data: trafficData[] ) {
    const timeKeys = data.map(x => x.time);
    updateChart(timeGoWorkCostChart, 
        [createSeriesData('traffic', data.map(x => x.data), timeKeys)],
        timeKeys);
});
