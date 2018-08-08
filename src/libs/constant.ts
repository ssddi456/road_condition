import * as path from "path";

export const dataDir = path.join(__dirname, '../../public/data');
export const timeReg = /\d{4}-\d{2}-\d{2}_\d{2}-\d{2}/;
export const goWorkDataFileNameReg = /^go_work_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}.json$/;
export const goHomeDataFileNameReg = /^go_home_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}.json$/;
export const goWorkPrefix = 'go_work_';
export const goHomePrefix = 'go_home_';
