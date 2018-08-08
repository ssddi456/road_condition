import { updateChart, createSeriesData } from "./util";
import { serveStatic } from "serve-static";
import { trafficData } from "../../src/routes";

const timeCostChart = echarts.init(document.getElementById('time-cost-chart') as HTMLDivElement);


$.getJSON('/', function (data: trafficData[] ) {
    const timeKeys = data.map(x => x.time);
    updateChart(timeCostChart, 
        [createSeriesData('traffic', data.map(x => x.data), timeKeys)],
        timeKeys);
});
