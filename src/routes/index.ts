import * as express from "express";
import * as fs from 'fs';
import * as path from 'path';
import { dataDir, goWorkDataFileNameReg, goHomeDataFileNameReg, timeReg } from "../libs/constant";
import { DisplayRoute } from "../libs/grab_map_data";

export const router = express.Router();

export type trafficData = {
    time: string,
    data: DisplayRoute[]
};

router.get('/', function (req, resp, next) {
    const type = req.query.type;

    const timeFrom = req.query.from;
    const timeTo = req.query.to;

    let filter: RegExp;
    if (type == 'go_home') {
        filter = goHomeDataFileNameReg;
    } else {
        filter = goWorkDataFileNameReg;
    }

    console.log('check type', type, filter);

    const dataFiles = fs.readdirSync(dataDir).filter(x => {
        if (!x.match(filter)) {
            return false;
        }
        const time = path.basename(x, path.extname(x)).match(timeReg)[0];

        if (timeFrom && time < timeFrom) {
            return false;
        }

        if (timeTo && time > timeTo) {
            return false;
        }
        return true;
    })
        .map(function (dataFileName) {
            const time = path.basename(dataFileName, path.extname(dataFileName)).match(timeReg)[0];
            const data = JSON.parse(fs.readFileSync(path.join(dataDir, dataFileName), 'utf8')) as DisplayRoute[];

            return {
                time,
                data: data.map(x => {
                    return {
                        duration: x.duration,
                        distance: x.distance
                    };
                })
            };
        });
    if (req.query.callback) {
        resp.write('/**/' + req.query.callback + '(');
        resp.write(JSON.stringify(dataFiles));
        resp.write(')');
    } else {
        console.log('origins', req.headers.origin);
        if (req.headers.origin) {
            resp.set({
                'Access-Control-Allow-Origin': req.headers.origin,
                'Access-Control-Allow-Methods': 'GET, POST',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type',
                'Access-Control-Max-Age': 86400,
            });
        }
        resp.json(dataFiles);
    }
});
