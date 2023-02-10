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
    const date1_ms = executionContent.startedAt.getTime();
    const date2_ms = executionContent.finishedAt.getTime();

    // Calculate the difference in milliseconds
    const execution_time = date2_ms - date1_ms;

    const logExt = {
      event,
      response: {
          statusCode:executionContent.statusCode,
          body:executionContent.resBody
      },
      execution_time
    }
    //console.log("firetail:log-ext:",logExt)
    console.log("firetail:log-ext:"+Buffer.from(JSON.stringify(logExt)).toString('base64'))

  } // END log


function wrap(next:Function){

  return (event:APIGatewayProxyEvent|APIGatewayProxyEventV2,context:Context)=> {
    const startedAt = new Date()
    let workInProgress:any = next(event,context,()=>{})
    if( ! workInProgress.then){
      workInProgress = Promise.resolve(workInProgress)
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

export = wrap
