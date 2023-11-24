import { APIGatewayProxyEvent, APIGatewayProxyEventV2, Context } from "aws-lambda";
declare function wrap(next: Promise | (Function & {
    then?: Function;
})): (event: APIGatewayProxyEvent | APIGatewayProxyEventV2, context: Context) => any;
export = wrap;
