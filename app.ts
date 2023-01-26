"use strict";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  Context } from 'aws-lambda';
import * as firetailWrapper from './utils/wrap'

const data = [{
  "id": 1,
  "name": "Bubbles",
  "tag": "fish"
},{
  "id": 2,
  "name": "Jax",
  "tag": "cat"
}]

module.exports.pets = firetailWrapper((event:APIGatewayProxyEvent|APIGatewayProxyEventV2,context:Context) => {
  // do work here..
  return {
    statusCode:200,
    body: JSON.stringify(data)
  };
}); // END pets
