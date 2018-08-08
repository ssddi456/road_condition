import * as path from "path";

export const dataDir = path.join(__dirname, '../../public/data');
export const timeReg = /^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}$/;
export const dataFileNameReg = /^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}.json$/;
