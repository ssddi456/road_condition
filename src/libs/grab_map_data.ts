import * as request from 'request';
import * as config from '../../config';
import * as fs from "fs";
import * as path from "path";
import { dataDir, goWorkPrefix, goHomePrefix } from './constant';

const direction_api = 'http://api.map.baidu.com/direction/v2/driving';
type direction_data = {
    origin: string,
    destination: string,
    tactics: string,
    ak: string,
};

function fix2(str) {
    str = '' + str;
    return str.length != 2 ? '0' + str : str;
}

const now = new Date();

function getDate ( config: direction_data, prefix: string){
    request.get(direction_api,
        {
            qs: config
        },
        function (err, resp, body) {
            if (err) {
                console.log('get data faild ', err);
                return;
            }
            const res = JSON.parse(body);
            const routes = res.result.routes as MapRoute[];
            const displayRoute = routes.map(directionData);
    
            fs.writeFile(
                path.join(dataDir,
                    prefix + '_' + 
                    now.getFullYear() + '-' +
                    fix2(now.getMonth() + 1) + '-' +
                    fix2(now.getDate()) + '_' +
                    fix2(now.getHours()) + '-' +
                    fix2(now.getMinutes()) + '.json'),
    
                JSON.stringify(displayRoute),
                'utf8',
                function (err) {
                    if (err) {
                        console.log('write file failed', err);
                    }
                });
        });
}


getDate(config as direction_data, goWorkPrefix);
getDate({
    origin: config.destination,
    destination: config.origin,
    ak: config.ak,
    tactics: config.tactics
}, goHomePrefix);

export interface POI {
    lng: number;
    lat: number;
}

export interface TrafficCondition {
    status: number;
    geo_cnt: number;
    distance: number;
}
export interface MapRouteStep {
    leg_index: number;
    road_name: string;
    direction: number;
    distance: number;
    road_type: number;
    toll: number;
    toll_distance: number;
    traffic_condition: TrafficCondition[],
    path: string;
    start_location: POI;
    end_location: POI;
}

export interface MapRoute {
    origin: POI;
    destination: POI;
    tag: string;
    distance: number;
    duration: number;
    taxi_fee: number;
    toll: number;
    toll_distance: number;
    steps: MapRouteStep[];
}

export interface DisplayStep {
    status: number;
    distance: number;
}

export interface DisplayRoute {
    distance: number;
    duration: number;
    taxi_fee: number;
    steps: DisplayStep[];
}

function directionData(route: MapRoute): DisplayRoute {
    const ret: DisplayRoute = {
        distance: route.distance,
        duration: route.duration,
        taxi_fee: route.taxi_fee,
        steps: [] as DisplayStep[],
    };
    for (let index = 0; index < route.steps.length; index++) {
        const step = route.steps[index];
        for (let indexCondition = 0; indexCondition < step.traffic_condition.length; indexCondition++) {
            const tranfficPeer = step.traffic_condition[indexCondition];
            ret.steps.push({
                distance: tranfficPeer.distance,
                status: tranfficPeer.status,
            });
        }
    }
    return ret;
}
