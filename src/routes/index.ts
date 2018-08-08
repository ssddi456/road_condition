import * as express from "express";
import * as fs from 'fs';
import * as path from 'path';
import { dataDir, dataFileNameReg } from "../libs/constant";
import { DisplayRoute } from "../libs/grab_map_data";

export const router = express.Router();

export type trafficData = {
    time: string,
    data: DisplayRoute[]
};

router.get('/', function(req, resp, next ){
    const dataFiles = fs.readdirSync(dataDir).filter(x => x.match(dataFileNameReg) )
                        .sort()
                        .map(function( dataFileName ){
                            const time = path.basename(dataFileName, path.extname(dataFileName));
                            const data = JSON.parse(fs.readFileSync(path.join(dataDir, dataFileName), 'utf8'));
                            return {
                                time,
                                data
                            };
                        });
    if( req.query.callback ){
        resp.write('/**/' + req.query.callback + '(');
        resp.write(JSON.stringify(dataFiles));
        resp.write(')');
    } else {
        console.log(req.headers.origin);
        if(req.headers.origin) {
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
