"use strict";
function log(event, executionContent) {
    var date1_ms = executionContent.startedAt.getTime();
    var date2_ms = executionContent.finishedAt.getTime();
    var executionTime = Number.isFinite(date2_ms - date1_ms)
        ? date2_ms - date1_ms
        : 0;
    var logExt = {
        event: event,
        response: {
            statusCode: executionContent.statusCode,
            body: executionContent.resBody,
        },
        executionTime: executionTime,
        observations: executionContent.observations,
        metadata: {
            libraryType: "Lambda wrapper",
            libraryVersion: "1.0.1",
            libraryLanguage: "JavaScript",
        },
    };
    console.log("firetail:log-ext:" +
        Buffer.from(JSON.stringify(logExt)).toString("base64"));
}
function wrap(next) {
    return function (event, context) {
        var startedAt = new Date();
        var observations = [];
        var workInProgress;
        if (typeof next === "function" && typeof next.then === "function") {
            workInProgress = next(event, context, function () { });
        }
        else {
            workInProgress = Promise.resolve(next(event, context, function () { }));
            observations.push({
                type: "firetail.configuration.synchronous.handler.detected",
                title: "The wrapper has been called with a synchronous function",
            });
        }
        return workInProgress.then(function (result) {
            var body = result.body, statusCode = result.statusCode;
            var finishedAt = new Date();
            log(event, {
                statusCode: statusCode || 200,
                resBody: body,
                startedAt: startedAt,
                finishedAt: finishedAt,
                observations: observations,
            });
            return result;
        });
    };
}
module.exports = wrap;
//# sourceMappingURL=index.js.map