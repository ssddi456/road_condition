import * as express from "express";
import * as path from "path";
import * as logger from "morgan";
import * as bodyParser from "body-parser";

import { router as index } from './src/routes/index';
import { compileTs } from "./src/libs/compile_ts";

export const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.get('favicon.ico', function (req, resp) {
    resp.end('');
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const publicResourcePath = path.join(__dirname, 'public');
app.use(compileTs({ root: publicResourcePath }));
app.use(express.static(publicResourcePath));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found') as Error & { status: number };
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.json(err);
});
