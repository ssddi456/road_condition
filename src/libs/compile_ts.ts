import * as ts from 'typescript';
import * as express from "express";
import * as path from 'path';
import * as fs from 'fs';

interface CompileTsMiddleWareConfig {
    root: string;
}
export function compileTs(comfig: CompileTsMiddleWareConfig) {
    return function (req: express.Request, resp: express.Response, next: express.NextFunction) {
        const relativePath = req.path;
        const extname = path.extname(relativePath);
        console.log('check ext', extname);

        if (extname !== '.ts') {
            return next();
        }
        const filePath = path.join(comfig.root, relativePath);
        if (fs.existsSync(filePath)) {
            fs.readFile(filePath, 'utf8', function (err, source) {
                if (err) {
                    console.log(filePath, err);
                    next(err);
                    return;
                }
                let result: ts.TranspileOutput;
                try {
                    result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.AMD } });
                } catch (e) {
                    console.log(filePath, e);
                    next(e);
                    return;
                }
                resp.send(result.outputText);
            });
        } else {
            next(new Error('file not exists:' + filePath));
        }
    }
}
