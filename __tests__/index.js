const Serverless_Events = require("./sampleEvents.json");
const data = require("./animals.json");
const firetailWrapper = require("../dist");

//=====================================================
//====================================== test GET calls
//=====================================================

describe("test Firetail:Serverless", () => {
    test("should work with lambda function url", done => {
        const next = firetailWrapper(event => {
            const statusCode = 200;
            if (
                event.queryStringParameters &&
                event.queryStringParameters.limit
            ) {
                return {
                    statusCode,
                    body: JSON.stringify(
                        data.slice(0, event.queryStringParameters.limit),
                    ),
                };
            }
            return {
                statusCode,
                body: JSON.stringify(data),
            };
        });

        const cLog = console.log;

        console.log = txt => {
            expect(txt.startsWith("firetail:log-ext:")).toBe(true);
        };
        next(Serverless_Events["lambda function url"])
            .then(a => {
                const { statusCode, body } = a;
                expect(statusCode).toBe(200);
                expect(body).toBe(
                    '[{"id":1,"name":"Bubbles","tag":"fish"},' +
                        '{"id":2,"name":"Jax","tag":"cat"},' +
                        '{"id":3,"name":"Tiger Lily","tag":"cat"},' +
                        '{"id":4,"name":"Buzz","tag":"dog"},' +
                        '{"id":5,"name":"Duke","owner":"Tom"}]',
                );
                return next(Serverless_Events["api Gateway Proxy Event"]);
            })
            .then(({ statusCode, body }) => {
                expect(statusCode).toBe(200);
                expect(body).toBe(
                    '[{"id":1,"name":"Bubbles","tag":"fish"},' +
                        '{"id":2,"name":"Jax","tag":"cat"}]',
                );
                console.log = cLog.bind(console);
                done();
            });
    });
});
