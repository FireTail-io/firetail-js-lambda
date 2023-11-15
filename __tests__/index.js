const Serverless_Events = require("./sampleEvents.json");
const data = require("./animals.json");
const firetailWrapper = require("../dist");

const timer = t => new Promise(r => setTimeout(() => r(), t));

//=====================================================
//====================================== test GET calls
//=====================================================

describe("test Firetail:Serverless", () => {
    test("should work with async lambda function url", done => {
        const time = 300;
        const next = firetailWrapper(async event => {
            await timer(time);
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
            const base64 = txt?.slice(17);
            const json = JSON.parse(atob(base64));
            expect(json.execution_time).toBeGreaterThan(time - 10);
        };
        next(Serverless_Events["lambda function url"])
            .then(({ statusCode, body }) => {
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

    test("should work with sync lambda function url", done => {
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
            const base64 = txt?.slice(17);
            const json = JSON.parse(atob(base64));
            expect(json.execution_time).toBeLessThan(10);
        };
        next(Serverless_Events["lambda function url"])
            .then(({ statusCode, body }) => {
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

    test("should not throw with non-function lambda function url", done => {
        const next = firetailWrapper({
            statusCode: 200,
            body: "some body",
        });

        const cLog = console.log;

        console.log = txt => {
            expect(txt.startsWith("firetail:log-ext:")).toBe(true);
            const base64 = txt?.slice(17);
            const json = JSON.parse(atob(base64));
            expect(json.execution_time).toBeLessThan(10);
        };
        next(Serverless_Events["lambda function url"]).then(
            ({ statusCode, body }) => {
                expect(statusCode).toBe(200);
                expect(body).toBe("some body");
                done();
            },
        );
    });

    test("should not throw when Date() does not work or status code is not found", done => {
        const next = firetailWrapper({
            statusCode: null,
            body: "some body",
        });

        const d = Date;

        class C {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
            foo() {
                return this.x + this.y;
            }
        }

        Date = class D {
            constructor() {}
            getTime() {
                return "not a date";
            }
        };

        const cLog = console.log;

        console.log = txt => {
            expect(txt.startsWith("firetail:log-ext:")).toBe(true);
            const base64 = txt?.slice(17);
            const json = JSON.parse(atob(base64));
            expect(json.execution_time).toBe(0);
            expect(json.response.statusCode).toBe(200);
        };
        next(Serverless_Events["lambda function url"]).then(
            ({ statusCode, body }) => {
                expect(statusCode).toBe(null);
                expect(body).toBe("some body");
                done();
            },
        );
    });
});
