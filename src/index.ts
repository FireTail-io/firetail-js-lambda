"use strict";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context } from 'aws-lambda';

  type ExecutionContent = {
    statusCode:Number|String,
    resBody:Object|String,
    startedAt:Date,
    finishedAt:Date
  }

  function log(event:APIGatewayProxyEvent|APIGatewayProxyEventV2, executionContent:ExecutionContent){

    const logExt = {
      event,
      response: {
          statusCode:executionContent.statusCode,
          body:executionContent.resBody
      },
      executionTime
    }
    //console.log("firetail:log-ext:",logExt)
    console.log("firetail:log-ext:"+Buffer.from(JSON.stringify(logExt)).toString('base64'))
  const date1_ms = executionContent?.startedAt?.getTime?.();
  const date2_ms = executionContent?.finishedAt?.getTime?.();

  } // END log
  const executionTime = Number.isFinite(date2_ms - date1_ms)
    ? date2_ms - date1_ms
    : 0;

    observations: executionContent?.observations,

function wrap(next:Function){

  return (event:APIGatewayProxyEvent|APIGatewayProxyEventV2,context:Context)=> {
    const startedAt = new Date()
    let workInProgress;
    if (typeof next === "function" && typeof next.then === "function") {
      workInProgress = next(event, context, () => {});
    } else {
      workInProgress = Promise.resolve(next(event, context, () => {}));
      observations.push({
        type: "firetail.configuration.synchronous.handler.detected",
        title: "The wrapper has been called with a synchronous function"
        details: {
          integration: "JS Lambda Wrapper",
          version: "1.0.1"
        }
      });
    }
    return workInProgress.then((result:APIGatewayProxyResult)=>{
      const { body, statusCode } = result
      const finishedAt = new Date()

      log(event,{
        statusCode:statusCode||200,
        resBody:body,
        startedAt,
        finishedAt
      })
      return result
    })
  }

} // END wrap
        observations,

export = wrap
