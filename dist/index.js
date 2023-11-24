"use strict";
function log(event, executionContent) {
    var date1_ms = executionContent.startedAt.getTime();
    var date2_ms = executionContent.finishedAt.getTime();
    var execution_time = Number.isFinite(date2_ms - date1_ms)
        ? date2_ms - date1_ms
        : 0;
    var logExt = {
        event: event,
        response: {
            statusCode: executionContent.statusCode,
            body: executionContent.resBody,
        },
        execution_time: execution_time,
    };
    console.log("firetail:log-ext:" +
        Buffer.from(JSON.stringify(logExt)).toString("base64"));
}
// @ts-ignore
function wrap(next) {
    return function (event, context) {
        var startedAt = new Date();
        var observations = [];
        var workInProgress;
        if (typeof next === "object" && typeof next.then === "function") {
            // next is a Promise or called async function
            workInProgress = next;
        }
        else if (next.constructor.name === "AsyncFunction") {
            // next is an uncalled async function
            workInProgress = next(event, context, function () { });
        }
        else if (typeof next === "function") {
            // next is an uncalled sync function
            workInProgress = Promise.resolve(next(event, context, function () { }));
        }
        else {
            // next is not a function
            workInProgress = Promise.resolve(next);
        }
        return workInProgress.then(function (result) {
            var body = result.body, statusCode = result.statusCode;
            var finishedAt = new Date();
            log(event, {
                statusCode: statusCode || 200,
                resBody: body,
                startedAt: startedAt,
                finishedAt: finishedAt,
            });
            return result;
        });
    };
}
module.exports = wrap;
//# sourceMappingURL=index.js.map