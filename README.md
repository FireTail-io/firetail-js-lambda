# Firetail Javascript Lambda Middleware


### Overview

The purpose of this module is to correctly log out the AWS Lambda event and response payload to allow the firetail extension to then send it on to the firetail logging api

The `import * as firetailWrapper from './utils/wrap'` is a function that wraps around an event handler function in a AWS Lambda to extract the event and response payloads into a base64 logging message.

### Installation
Install the module copy the `/utils/wrap.ts` into your project

Implementing Middleware in lambda function
```js
import * as firetailWrapper from './utils/wrap'

module.exports.myFn = firetailWrapper((event,context) => {
  // do work here..
  return {
    statusCode:200,
    body: JSON.stringify(data)
  };
});
```
