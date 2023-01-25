import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context } from 'aws-lambda';

import log from './log'

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
