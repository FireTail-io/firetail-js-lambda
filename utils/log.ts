"use strict";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2
 } from 'aws-lambda';

type ExecutionContent = {
  statusCode:Number|String,
  resBody:Object|String,
  startedAt:Date,
  finishedAt:Date
}

function out(event:APIGatewayProxyEvent|APIGatewayProxyEventV2, executionContent:ExecutionContent){
  const date1_ms = executionContent.startedAt.getTime();
  const date2_ms = executionContent.finishedAt.getTime();

  // Calculate the difference in milliseconds
  const executionTime = date2_ms - date1_ms;

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

} // END out

export = out
