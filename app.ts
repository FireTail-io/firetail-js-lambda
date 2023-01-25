"use strict";
import firetailWrapper from './utils/wrap'

const data = [{
  "id": 1,
  "name": "Bubbles",
  "tag": "fish"
},{
  "id": 2,
  "name": "Jax",
  "tag": "cat"
}]

module.exports.pets = firetailWrapper((event,context) => {
  // do work here..
  return {
    statusCode:200,
    body: JSON.stringify(data)
  };
}); // END pets
console.log("App Loaded")
