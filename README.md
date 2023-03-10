# Firetail Javascript Lambda Middleware


### Overview

The purpose of this module is to correctly log out the AWS Lambda event and response payload to allow the firetail extension to then send it on to the firetail logging api

[![Code Coverage](https://github.com/FireTail-io/firetail-js-lambda/actions/workflows/codecov.yml/badge.svg)](https://github.com/FireTail-io/firetail-js-lib/actions/workflows/codecov.yml) [![codecov](https://codecov.io/gh/FireTail-io/firetail-js-lambda/branch/main/graph/badge.svg?token=BN44NPKV8H)](https://codecov.io/gh/FireTail-io/firetail-js-lambda) [![License](https://img.shields.io/pypi/l/firetail.svg)](https://github.com/FireTail-io/firetail-js-lambda/blob/main/LICENSE.txt)

The [![npm version](https://badge.fury.io/js/@public.firetail.io%2Ffiretail-js-lambda.svg)](https://www.npmjs.com/package/@public.firetail.io/firetail-js-lambda) is a function that wraps around an event handler function in a AWS Lambda to extract the event and response payloads into a base64 logging message.

### Installation
Install the module into your project

Implementing Middleware in lambda function
```js
import * as firetailWrapper from '@public.firetail.io/firetail-js-lambda'

module.exports.myFn = firetailWrapper((event,context) => {
  // do work here..
  return {
    statusCode:200,
    body: JSON.stringify(data)
  };
});
```
