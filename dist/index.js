"use strict";
function log(event, executionContent) {
    var date1_ms = executionContent.startedAt.getTime();
    var date2_ms = executionContent.finishedAt.getTime();
    // Calculate the difference in milliseconds
    var executionTime = date2_ms - date1_ms;
    var logExt = {
        event: event,
        response: {
            statusCode: executionContent.statusCode,
            body: executionContent.resBody
        },
        executionTime: executionTime
    };
    //console.log("firetail:log-ext:",logExt)
    console.log("firetail:log-ext:" + Buffer.from(JSON.stringify(logExt)).toString('base64'));
} // END log
function wrap(next) {
    return function (event, context) {
        var startedAt = new Date();
        var workInProgress = next(event, context, function () { });
        if (!workInProgress.then) {
            workInProgress = Promise.resolve(workInProgress);
        }
        return workInProgress.then(function (result) {
            var body = result.body, statusCode = result.statusCode;
            var finishedAt = new Date();
            log(event, {
                statusCode: statusCode || 200,
                resBody: body,
                startedAt: startedAt,
                finishedAt: finishedAt
            });
            return result;
        });
    };
} // END wrap
module.exports = wrap;
//# sourceMappingURL=index.js.map